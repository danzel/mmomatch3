import AvailabilityManager = require('./availabilityManager');
import Bot = require('../Bot/bot');
import BootData = require('../DataPackets/bootData');
import ComboOwnership = require('../Simulation/Scoring/comboOwnership');
import DataStorage = require('./Database/dataStorage');
import DebugLogger = require('../debugLogger');
import DirectInputApplier = require('../Simulation/SinglePlayer/directInputApplier');
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
import UnavailableData = require('../DataPackets/unavailableData');
import UserTokenProvider = require('./userTokenProvider');


class Server {
	levelStarted = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }>();
	warning = new LiteEvent<{ str: string, data?: any }>();
	playerJoined = new LiteEvent<Player>();
	playerLeft = new LiteEvent<Player>();

	private availabilityManager: AvailabilityManager;
	private packetGenerator: PacketGenerator = new PacketGenerator();
	private playerProvider: PlayerProvider = new PlayerProvider();
	private newNameCollection = new NewNameCollection();
	private tickDataFactory: TickDataFactory;

	private currentlyAvailable: boolean;

	private level: LevelDef;
	private simulation: Simulation;
	private gameEndDetector: GameEndDetector;
	private moveRateLimiter: MoveRateLimiter;

	private clientsRequiringJoin = new Array<string>();
	private clientsRequiringBoot = new Array<Player>();
	private clients: { [id: string]: Player } = {};
	private clientsWhoLeftThisLevel = new Array<Player>();

	private bots = new Array<Bot>();
	private botPlayers = new Array<Player>();

	constructor(private serverComms: ServerComms, private levelAndSimulationProvider: LevelAndSimulationProvider, private storage: DataStorage, private userTokenProvider: UserTokenProvider, private config: ServerConfig) {
		this.availabilityManager = new AvailabilityManager(config);
		this.currentlyAvailable = this.availabilityManager.availableAt(new Date())

		serverComms.connected.on(details => this.connectionReceived(details.id));
		serverComms.disconnected.on(id => this.connectionDisconnected(id));
		serverComms.dataReceived.on(data => this.dataReceived(data));

		for (var i = 0; i < this.config.botCount; i++) {
			this.botPlayers.push(this.playerProvider.createPlayer(null, null));
		};
	}

	getRealPlayerCount(): number { return Object.keys(this.clients).length + this.clientsRequiringBoot.length; }
	getPlayerCount(): number { return this.getRealPlayerCount() + this.bots.length; }

	public start() {
		if (this.currentlyAvailable) {
			this.loadLevel(this.config.initialLevel);
		}
	}

	private loadLevel(levelNumber: number) {
		let level = this.levelAndSimulationProvider.loadLevel(levelNumber, this.getPlayerCount());
		this.level = level.level;
		this.simulation = level.simulation;

		this.gameEndDetector = new GameEndDetector(this.level, this.simulation);
		this.moveRateLimiter = new MoveRateLimiter(3);
		this.tickDataFactory = new TickDataFactory(this.simulation, this.simulation.scoreTracker, this.newNameCollection, this.config.framesPerTick);
		//new DebugLogger(this.simulation);

		this.bots.length = 0;
		let desiredBots = this.config.botsLeaveForPlayers ? (this.config.botCount - this.getRealPlayerCount()) : this.config.botCount;
		for (var i = 0; i < desiredBots; i++) {
			this.bots.push(new Bot(this.level, this.simulation, new DirectInputApplier(this.botPlayers[i].id, this.simulation.swapHandler, this.simulation.inputVerifier, this.simulation.grid)));
		}

		let bootData = this.packetGenerator.generateBootData(this.level, this.simulation, this.newNameCollection, this.availabilityManager.currentAvailableEndJSON(new Date()));

		this.newNameCollection.clear();
		this.clientsWhoLeftThisLevel.length = 0;
		this.serverComms.sendBoot(bootData, Object.keys(this.clients));

		this.gameEndDetector.gameEnded.on((gameEndType) => {
			let players = new Array<Player>();
			for (var key in this.clients) {
				players.push(this.clients[key]);
			}
			this.storage.recordLevelResult(this.level, gameEndType, players, this.simulation.scoreTracker);
			setTimeout(() => this.loadLevel(levelNumber + 1), 8000);
		});

		this.levelStarted.trigger({ level: this.level, simulation: this.simulation, gameEndDetector: this.gameEndDetector });
	}

	private connectionReceived(id: string) {
		if (!this.currentlyAvailable) {
			//TODO: We should sorta be able to push people straight in to this.clients if we aren't available, this would mean they'd boot faster
			this.serverComms.sendUnavailable(new UnavailableData(this.availabilityManager.nextAvailableJSON(new Date())), id);
		}
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
		} else {
			this.warning.trigger({ str: 'Received unexpected packet', data: data.packet });
		}

	}

	private joinReceived(id: string, join: JoinData) {
		let rejectReason: string;
		//Version mismatch: Kick them
		if (!this.config.skipVersionCheck && this.config.version && this.config.version != join.version) {
			rejectReason = 'version';
		}
		//They provided an invalid token (logged in and server restarted, or they are trying to hax)
		if (join.userToken && !this.userTokenProvider.getUserForToken(join.userToken)) {
			rejectReason = 'token';
		}
		if (rejectReason) {
			this.clientsRequiringJoin.splice(this.clientsRequiringJoin.indexOf(id), 1);
			this.serverComms.sendReject(new RejectData(rejectReason), id);
			this.serverComms.disconnect(id);
			return;
		}

		if (join.playerName && join.playerName.length > 16) {
			join.playerName = join.playerName.substr(0, 16);
		}

		var player = this.playerProvider.createPlayer(id, join.playerName);
		this.playerJoined.trigger(player);

		if (join.userToken && this.userTokenProvider.getUserForToken(join.userToken)) {
			let user = this.userTokenProvider.getUserForToken(join.userToken);
			this.storage.ensurePlayerExists(user.provider, user.providerId, join.playerName, (databaseId) => player.databaseId = databaseId);
		}


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
			} else {
				this.warning.trigger({ str: 'player hit moveRateLimit', data: id });
			}
		}
	}

	update() {
		let nowAvailable = this.availabilityManager.availableAt(new Date());
		if (!this.currentlyAvailable && !nowAvailable) {
			return;
		}
		if (!this.currentlyAvailable && nowAvailable) {
			this.currentlyAvailable = true;
			this.start();
			return;
		}
		if (this.currentlyAvailable && !nowAvailable) {
			this.currentlyAvailable = false;
			this.serverComms.sendUnavailable(new UnavailableData(this.availabilityManager.nextAvailableJSON(new Date())));
			return;
		}

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
			let bootData = this.packetGenerator.generateBootData(this.level, this.simulation, this.newNameCollection, this.availabilityManager.currentAvailableEndJSON(new Date()));
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