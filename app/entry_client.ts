import Client = require('./Client/client');
import ClientInputApplier = require('./Client/clientInputApplier');
import ClientSpawnManager = require('./Client/clientSpawnManager');
import DebugLogger = require('./debugLogger');
import FrameData = require('./DataPackets/frameData');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import InputHandler = require('./Input/inputHandler');
import InputVerifier = require('./Simulation/inputVerifier');
import LevelDef = require('./Simulation/Levels/levelDef');
import Scene = require('./Scenes/scene');
import Serializer = require('./Serializer/simple');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import TickData = require('./DataPackets/tickData');

class AppEntry {
	client: Client;
	game: Phaser.Game;
	simulation: Simulation;

	scene: Scene;
	sceneGroup: Phaser.Group;

	private frameQueue: Array<FrameData> = [];

	constructor() {
		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

		GraphicsLoader.loadBalls(this.game, 'basic', 11);
	}

	create() {
		console.log('create');
		
		this.client = new Client(window.location.origin, new Serializer());
		//this.client = new Client('http://' + window.location.hostname + ':8091', new Serializer());
		this.client.simulationReceived.on(data => this.simulationReceived(data));
		this.client.tickReceived.on(tick => this.tickReceived(tick));
		this.client.playerIdReceived.on(playerId => this.playerIdReceived(playerId));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation }) {
		if (this.sceneGroup) {
			this.sceneGroup.destroy();
		}
		this.frameQueue.length = 0;
		
		this.simulation = data.simulation;
		let gameEndDetector = new GameEndDetector(data.level, data.simulation); //TODO: Do we need a special client version?
		let inputApplier = new ClientInputApplier(this.client, new InputVerifier(this.simulation.grid, data.simulation.matchChecker, true), this.simulation.grid);

		this.sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(this.sceneGroup, data.level, this.simulation, inputApplier, gameEndDetector, { alwaysRunUpdates: true, gameOverCountdown: 5 });
		//new DebugLogger(data.simulation);
	}

	playerIdReceived(playerId: number) {
		(<SimulationScene>this.scene).scoreRenderer.notifyPlayerId(playerId); //TODO: Unhack assumption of child scene
	}

	tickReceived(tickData: TickData) {
		//Apply all existing frameQueue
		while (this.frameQueue.length > 0) {
			this.update();
		}

		for (let i = 0; i < tickData.framesElapsed; i++) {
			this.frameQueue.push(tickData.frameData[i]);
		}
		
		//This should really be applied at the end of playing the frameQueue
		if (tickData.points) {
			(<SimulationScene>this.scene).scoreRenderer.updateData(tickData.points); //TODO: Unhack assumption of child scene
		}
		if (tickData.playerCount) {
			(<SimulationScene>this.scene).playerCountRenderer.updateData(tickData.playerCount); //TODO: Unhack assumption of child scene
		}
	}

	update() {
		if (this.frameQueue.length == 0) {
			return;
		}

		this.runNextFrame();
		this.scene.update();
	}

	private runNextFrame() {
		let frame = this.frameQueue.shift();

		if (frame) {
			//Swaps
			for (let i = 0; i < frame.swapData.length; i++) {
				var swap = frame.swapData[i];
				var left = this.simulation.grid.findMatchableById(swap.leftId);
				var right = this.simulation.grid.findMatchableById(swap.rightId);
				this.simulation.swapHandler.swap(swap.playerId, left, right);
			}
			
			//Spawns
			(<ClientSpawnManager>this.simulation.spawnManager).notifySpawns(frame.spawnData);
		}
	}
}

new AppEntry();