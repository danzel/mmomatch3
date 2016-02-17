import BootData = require('../DataPackets/bootData');
import ComboOwnership = require('../Simulation/Scoring/comboOwnership');
import DebugLogger = require('../debugLogger');
import FrameData = require('../DataPackets/frameData');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import GridFactory = require('../Simulation/Levels/gridFactory');
import InputVerifier = require('../Simulation/inputVerifier');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDefFactory = require('../Simulation/Levels/levelDefFactory');
import Matchable = require('../Simulation/matchable');
import MatchableFactory = require('../Simulation/matchableFactory');
import PacketGenerator = require('../DataPackets/packetGenerator');
import PacketType = require('../DataPackets/packetType');
import Player = require('../Simulation/Scoring/player');
import PlayerProvider = require('../Simulation/Scoring/playerProvider');
import RandomGenerator = require('../Simulation/randomGenerator');
import ScoreTracker = require('../Simulation/Scoring/scoreTracker');
import Serializer = require('../Serializer/serializer');
import Simulation = require('../Simulation/simulation');
import SocketServer = require('./socketServer');
import SpawningSpawnManager = require('../Simulation/spawningSpawnManager');
import SpawnData = require('../DataPackets/spawnData');
import Swap = require('../Simulation/swap');
import SwapClientData = require('../DataPackets/swapClientData');
import SwapServerData = require('../DataPackets/swapServerData');
import TickData = require('../DataPackets/tickData');
import TickDataFactory = require('./tickDataFactory');

class Server {
	private packetGenerator: PacketGenerator = new PacketGenerator();
	private playerProvider: PlayerProvider = new PlayerProvider();
	private scoreTracker: ScoreTracker;
	private tickDataFactory: TickDataFactory;
	
	private level: LevelDef;
	private simulation: Simulation;
	private inputVerifier: InputVerifier;

	private clientsRequiringBoot: Array<string> = [];
	private clients: { [id: string]: Player } = {};

	constructor(private socketServer: SocketServer, private levelDefFactory: LevelDefFactory) {
		//TOOD: Event listeners
		socketServer.connected.on((id) => this.connectionReceived(id));
		socketServer.disconnected.on((id) => this.connectionDisconnected(id));
		socketServer.swapReceived.on((data) => this.swapReceived(data));
	}

	loadLevel(levelNumber: number) {
		this.level = new LevelDefFactory().getLevel(levelNumber);
		let grid = GridFactory.createGrid(this.level);
		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), this.level.colorCount);
		this.simulation = new Simulation(grid, spawnManager, matchableFactory);
		let gameEndDetector = new GameEndDetector(this.level, this.simulation);
		this.inputVerifier = new InputVerifier(this.simulation.grid, this.simulation.matchChecker, gameEndDetector, true);
		this.scoreTracker = new ScoreTracker(new ComboOwnership(this.simulation.grid, this.simulation.swapHandler, this.simulation.matchPerformer, this.simulation.quietColumnDetector));
		this.tickDataFactory = new TickDataFactory(this.simulation, this.scoreTracker);
		//new DebugLogger(this.simulation);

		//TODO: Should we split boot and levels? boot has playerid in it which sucks
		let bootData = this.packetGenerator.generateBootData(this.level, this.simulation);
		for (let i in this.clients) {
			bootData.playerId = this.clients[i].id;
			this.socketServer.sendBoot(bootData, i);
		}
		
		gameEndDetector.gameEnded.on((victory) => {
			setTimeout(() => this.loadLevel(levelNumber + (victory ? 1 : 0)), 5000);
		})
	}

	private connectionReceived(id: string) {
		this.clientsRequiringBoot.push(id);
	}

	private connectionDisconnected(id: string) {
		console.log('disconnection', id);
		if (this.clients[id]) {
			delete this.clients[id];
		} else {
			this.clientsRequiringBoot.splice(this.clientsRequiringBoot.indexOf(id), 1);
		}
	}

	private swapReceived(data: { id: string, swap: SwapClientData }) {
		var player = this.clients[data.id];
		if (!player) {
			console.log("ignoring received data from client before booted");
			return;
		}

		//Find the two
		let left = this.simulation.grid.findMatchableById(data.swap.leftId);
		let right = this.simulation.grid.findMatchableById(data.swap.rightId);
		if (this.inputVerifier.swapIsValid(left, right)) {
			this.simulation.swapHandler.swap(player.id, left, right);
		}
	}

	update(dt: number) {

		this.simulation.update(dt);

		var tickData = this.tickDataFactory.getTickIfReady(Object.keys(this.clients).length + this.clientsRequiringBoot.length);

		if (!tickData) {
			return;
		}

		//We should only be sending updates to clients we've already sent a boot to
		this.socketServer.sendTick(tickData, Object.keys(this.clients));

		if (this.clientsRequiringBoot.length > 0) {
			let bootData = this.packetGenerator.generateBootData(this.level, this.simulation);
			this.clientsRequiringBoot.forEach((id) => {
				var player = this.playerProvider.createPlayer();
				bootData.playerId = player.id;
				this.socketServer.sendBoot(bootData, id);

				this.clients[id] = player;
			});
			this.clientsRequiringBoot.length = 0;
		}
	}
}

export = Server;