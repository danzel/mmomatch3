import AvailabilityManager = require('./availabilityManager');
import Bot = require('../Bot/bot');
import BootData = require('../DataPackets/bootData');
import ComboOwnership = require('../Simulation/Scoring/comboOwnership');
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
import PacketGenerator = require('../DataPackets/packetGenerator');
import PacketType = require('../DataPackets/packetType');
import Player = require('../Simulation/Scoring/player');
import PlayerProvider = require('../Simulation/Scoring/playerProvider');
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


class Server {
	levelStarted = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }>();

	private availabilityManager: AvailabilityManager;
	private packetGenerator: PacketGenerator = new PacketGenerator();
	private playerProvider: PlayerProvider = new PlayerProvider();
	private tickDataFactory: TickDataFactory;

	private currentlyAvailable: boolean;

	private level: LevelDef;
	private simulation: Simulation;
	private gameEndDetector: GameEndDetector;

	private clientsRequiringJoin: Array<string> = [];
	private clientsRequiringBoot: Array<Player> = [];
	private clients: { [id: string]: Player } = {};

	private bots = new Array<Bot>();
	private botPlayers = new Array<Player>();

	constructor(private serverComms: ServerComms, private levelAndSimulationProvider: LevelAndSimulationProvider, private config: ServerConfig) {
		this.availabilityManager = new AvailabilityManager(config);
		this.currentlyAvailable = this.availabilityManager.availableAt(new Date())

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
		if (this.currentlyAvailable) {
			this.loadLevel(this.config.initialLevel);
		}
	}

	private loadLevel(levelNumber: number) {
		let level = this.levelAndSimulationProvider.loadLevel(levelNumber, this.getPlayerCount());
		this.level = level.level;
		this.simulation = level.simulation;

		this.gameEndDetector = new GameEndDetector(this.level, this.simulation);
		this.tickDataFactory = new TickDataFactory(this.simulation, this.simulation.scoreTracker, this.config.framesPerTick);
		//new DebugLogger(this.simulation);

		this.bots.length = 0;
		let desiredBots = this.config.botsLeaveForPlayers ? (this.config.botCount - this.getRealPlayerCount()) : this.config.botCount;
		for (var i = 0; i < desiredBots; i++) {
			this.bots.push(new Bot(this.level, this.simulation, new DirectInputApplier(this.botPlayers[i].id, this.simulation.swapHandler, this.simulation.inputVerifier, this.simulation.grid)));
		}

		let bootData = this.packetGenerator.generateBootData(this.level, this.simulation, this.availabilityManager.currentAvailableEndJSON(new Date()));
		this.serverComms.sendBoot(bootData, Object.keys(this.clients));

		this.gameEndDetector.gameEnded.on((victory) => {
			setTimeout(() => this.loadLevel(levelNumber + 1), 5000);
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
			console.warn('Received unexpected packet ', data.packet);
		}

	}

	private joinReceived(id: string, join: JoinData) {
		var player = this.playerProvider.createPlayer(id, join.playerName);

		//TODO: I think this means two players joining in the same tick won't get each others names?
		let names: { [id: number]: string } = {};
		for (var key in this.clients) {
			var p = this.clients[key];
			if (p.name) {
				names[p.id] = p.name;
			}
		}

		this.serverComms.sendInit(new InitData(player.id, names), id);

		//TODO: Maybe instead of immediately sending names, wait till they get their first points?
		if (join.playerName) {
			this.tickDataFactory.notifyNewPlayer(player.id, join.playerName);
		}

		this.clientsRequiringJoin.splice(this.clientsRequiringJoin.indexOf(id), 1);
		this.clientsRequiringBoot.push(player);
	}

	private swapReceived(id: string, swap: SwapClientData) {
		var player = this.clients[id];
		if (!player) {
			console.log("ignoring received data from client before booted");
			return;
		}

		//Find the two
		let left = this.simulation.grid.findMatchableById(swap.leftId);
		let right = this.simulation.grid.findMatchableById(swap.rightId);
		if (this.simulation.inputVerifier.swapIsValid(left, right)) {
			this.simulation.swapHandler.swap(player.id, left, right);
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
			let bootData = this.packetGenerator.generateBootData(this.level, this.simulation, this.availabilityManager.currentAvailableEndJSON(new Date()));
			var toBoot = new Array<string>();
			this.clientsRequiringBoot.forEach((player) => {
				toBoot.push(player.commsId);
				this.clients[player.commsId] = player;
			});
			this.serverComms.sendBoot(bootData, toBoot);
			this.clientsRequiringBoot.length = 0;
		}

		this.bots.forEach(b => b.update(1 / this.config.fps));
	}
}

export = Server;