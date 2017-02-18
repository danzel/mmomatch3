import Bot = require('../Bot/bot');
import BootData = require('../DataPackets/bootData');
import ComboOwnership = require('../Simulation/Scoring/comboOwnership');
import DebugLogger = require('../debugLogger');
import DirectInputApplier = require('../Simulation/SinglePlayer/directInputApplier');
import EmoteClientData = require('../DataPackets/emoteClientData');
import EmoteData = require('../DataPackets/emoteData');
import EmoteLimiter = require('./emoteLimiter');
import EmoteProxy = require('../Util/emoteProxy');
import FrameData = require('../DataPackets/frameData');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import InitData = require('../DataPackets/initData');
import InputVerifier = require('../Simulation/inputVerifier');
import JoinData = require('../DataPackets/joinData');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelAndSimulationProvider = require('./levelAndSimulationProvider');
import LiteEvent = require('../liteEvent');
import Matchable = require('../Simulation/matchable');
import MoveRateLimiter = require('./moveRateLimiter');
import NewNameCollection = require('./newNameCollection');
import PacketGenerator = require('../DataPackets/packetGenerator');
import PacketType = require('../DataPackets/packetType');
import Player = require('../Simulation/Scoring/player');
import PlayerProvider = require('../Simulation/Scoring/playerProvider');
import RejectData = require('../DataPackets/rejectData');
import ScoreTracker = require('../Simulation/Scoring/scoreTracker');
import Serializer = require('../Serializer/serializer');
import ServerComms = require('./serverComms');
import ServerConfig = require('./config/serverConfig');
import Simulation = require('../Simulation/simulation');
import SpawnData = require('../DataPackets/spawnData');
import Swap = require('../Simulation/swap');
import SwapClientData = require('../DataPackets/swapClientData');
import SwapServerData = require('../DataPackets/swapServerData');
import TickData = require('../DataPackets/tickData');
import TickDataFactory = require('./tickDataFactory');


class Server {
	levelStarted = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }>();
	warning = new LiteEvent<{ str: string, data?: any }>();
	playerJoined = new LiteEvent<Player>();
	playerLeft = new LiteEvent<Player>();
	emotePerformed = new LiteEvent<{ playerId: number, emoteNumber: number }>();

	private packetGenerator: PacketGenerator = new PacketGenerator();
	private playerProvider: PlayerProvider = new PlayerProvider();
	private newNameCollection = new NewNameCollection();
	private tickDataFactory: TickDataFactory;

	private level: LevelDef;
	private simulation: Simulation;
	private gameEndDetector: GameEndDetector;
	private moveRateLimiter: MoveRateLimiter;
	private emoteLimiter: EmoteLimiter;

	private clientsRequiringJoin = new Array<string>();
	private clientsRequiringBoot = new Array<Player>();
	private clients: { [id: string]: Player } = {};
	private clientsWhoLeftThisLevel = new Array<Player>();

	private bots = new Array<Bot>();
	private botPlayers = new Array<Player>();

	constructor(private serverComms: ServerComms, private levelAndSimulationProvider: LevelAndSimulationProvider, private config: ServerConfig) {
		serverComms.connected.on(id => this.connectionReceived(id));
		serverComms.disconnected.on(id => this.connectionDisconnected(id));
		serverComms.dataReceived.on(data => this.dataReceived(data));

		for (var i = 0; i < this.config.botCount; i++) {
			this.botPlayers.push(this.playerProvider.createPlayer(null, null));
		};
	}

	getRealPlayerCount(): number { return Object.keys(this.clients).length + this.clientsRequiringBoot.length; }
	getPlayerCount(): number { return this.getRealPlayerCount() + this.bots.length; }

	public start() {
		this.loadLevel(this.config.initialLevel);
	}

	private loadLevel(levelNumber: number) {
		let level = this.levelAndSimulationProvider.loadLevel(levelNumber, this.getPlayerCount());
		this.level = level.level;
		this.simulation = level.simulation;

		this.gameEndDetector = new GameEndDetector(this.level, this.simulation);
		this.moveRateLimiter = new MoveRateLimiter(3);
		this.emoteLimiter = new EmoteLimiter();
		this.tickDataFactory = new TickDataFactory(this.simulation, this.simulation.scoreTracker, this.newNameCollection, this.config.framesPerTick);
		let emoteProxy = new EmoteProxy();
		//new DebugLogger(this.simulation);

		this.bots.length = 0;
		let desiredBots = this.config.botsLeaveForPlayers ? (this.config.botCount - this.getRealPlayerCount()) : this.config.botCount;
		for (var i = 0; i < desiredBots; i++) {
			this.bots.push(new Bot(this.level, this.simulation, new DirectInputApplier(this.botPlayers[i].id, this.simulation.swapHandler, this.simulation.inputVerifier, this.simulation.grid, emoteProxy)));
		}

		let bootData = this.packetGenerator.generateBootData(this.level, this.simulation, this.newNameCollection);

		this.newNameCollection.clear();
		this.clientsWhoLeftThisLevel.length = 0;
		this.serverComms.sendBoot(bootData, Object.keys(this.clients));

		this.gameEndDetector.gameEnded.on((victory) => {
			setTimeout(() => this.loadLevel(levelNumber + 1), 8000);
		});

		this.levelStarted.trigger({ level: this.level, simulation: this.simulation, gameEndDetector: this.gameEndDetector });
	}

	private connectionReceived(id: string) {
		this.clientsRequiringJoin.push(id);
	}

	private connectionDisconnected(id: string) {
		console.log('disconnection', id);
		if (this.clients[id]) {
			this.playerLeft.trigger(this.clients[id]);
			this.clientsWhoLeftThisLevel.push(this.clients[id]);
			delete this.clients[id];
		} else {
			for (let i = 0; i < this.clientsRequiringBoot.length; i++) {
				if (this.clientsRequiringBoot[i].commsId == id) {
					this.clientsRequiringBoot.splice(i, 1);
					break;
				}
			}
			let index = this.clientsRequiringJoin.indexOf(id);
			if (index >= 0) {
				this.clientsRequiringJoin.splice(index, 1);
			}
		}
	}

	private dataReceived(data: { id: string, packet: { packetType: PacketType, data: any } }) {
		if (data.packet.packetType == PacketType.Join) {
			this.joinReceived(data.id, <JoinData>data.packet.data);
		} else if (data.packet.packetType == PacketType.SwapClient) {
			this.swapReceived(data.id, <SwapClientData>data.packet.data);
		} else if (data.packet.packetType == PacketType.EmoteClient) {
			this.emoteReceived(data.id, <EmoteClientData>data.packet.data);
		} else {
			this.warning.trigger({ str: 'Received unexpected packet', data: data.packet });
		}

	}

	private joinReceived(id: string, join: JoinData) {
		//Version mismatch: Kick them
		if (!this.config.skipVersionCheck && this.config.version && this.config.version != join.version) {
			this.clientsRequiringJoin.splice(this.clientsRequiringJoin.indexOf(id), 1);
			this.serverComms.sendReject(new RejectData('version'), id);
			this.serverComms.disconnect(id);
			return;
		}

		if (join.playerName && join.playerName.length > 16) {
			join.playerName = join.playerName.substr(0, 16);
		}

		var player = this.playerProvider.createPlayer(id, join.playerName);
		this.playerJoined.trigger(player);

		let names: { [id: number]: string } = {};
		for (var key in this.clients) {
			var p = this.clients[key];
			if (p.name) {
				names[p.id] = p.name;
			}
		}
		this.clientsWhoLeftThisLevel.forEach(p => {
			if (p.name) {
				names[p.id] = p.name;
			}
		});

		this.serverComms.sendInit(new InitData(player.id, names), id);

		//TODO: Maybe instead of immediately sending names, wait till they get their first points?
		if (join.playerName) {
			this.newNameCollection.notifyNewPlayer(player);
		}

		this.clientsRequiringJoin.splice(this.clientsRequiringJoin.indexOf(id), 1);
		this.clientsRequiringBoot.push(player);
	}

	private swapReceived(id: string, swap: SwapClientData) {
		var player = this.clients[id];
		if (!player) {
			this.warning.trigger({ str: 'ignoring received data from client before booted' });
			return;
		}

		//Find the two
		let left = this.simulation.grid.findMatchableById(swap.leftId);
		let right = this.simulation.grid.findMatchableById(swap.rightId);
		if (this.simulation.inputVerifier.swapIsValid(left, right)) {
			if (this.moveRateLimiter.limitCheck(player.id, this.simulation.timeRunning)) {
				this.simulation.swapHandler.swap(player.id, left, right);
				this.emoteLimiter.reset(player.id);
			} else {
				this.warning.trigger({ str: 'player hit moveRateLimit', data: id });
			}
		}
	}

	private emoteReceived(id: string, emote: EmoteClientData) {
		var player = this.clients[id];
		if (!player) {
			this.warning.trigger({ str: 'ignoring received data from client before booted' });
			return;
		}

		if (this.emoteLimiter.limitCheck(player.id)) {
			//broadcast emote
			let emoteResponse = new EmoteData(player.id, emote.emoteNumber, emote.x, emote.y);
			this.serverComms.sendEmote(emoteResponse, Object.keys(this.clients).filter(x => x != player.commsId))

			this.emotePerformed.trigger({ playerId: player.id, emoteNumber: emote.emoteNumber });
		}
	}

	update() {
		if (this.getRealPlayerCount() == 0) {
			return;
		}


		this.simulation.update();

		var tickData = this.tickDataFactory.getTickIfReady(this.getPlayerCount());

		if (!tickData) {
			return;
		}

		//We should only be sending updates to clients we've already sent a boot to
		this.serverComms.sendTick(tickData, Object.keys(this.clients));

		if (this.clientsRequiringBoot.length > 0) {
			let bootData = this.packetGenerator.generateBootData(this.level, this.simulation, this.newNameCollection);
			var toBoot = new Array<string>();
			this.clientsRequiringBoot.forEach((player) => {
				toBoot.push(player.commsId);
				this.clients[player.commsId] = player;
			});
			this.serverComms.sendBoot(bootData, toBoot);
			this.clientsRequiringBoot.length = 0;
		}

		this.newNameCollection.clear();
		this.bots.forEach(b => b.update(1 / this.config.fps));
	}
}

export = Server;