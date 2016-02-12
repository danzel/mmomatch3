import Client = require('./Client/client');
import ClientInputApplier = require('./Client/clientInputApplier');
import ClientSpawnManager = require('./Client/clientSpawnManager');
import FrameData = require('./DataPackets/frameData');
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
		this.client.simulationReceived.on(this.simulationReceived.bind(this));
		this.client.tickReceived.on(this.tickReceived.bind(this));
		this.client.playerIdReceived.on(this.playerIdReceived.bind(this));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation }) {
		this.simulation = data.simulation;
		let inputApplier = new ClientInputApplier(this.client, new InputVerifier(this.simulation.grid, data.simulation.matchChecker, true), this.simulation.grid);

		this.scene = new SimulationScene(this.game.add.group(), data.level, this.simulation, inputApplier);
	}

	playerIdReceived(playerId: number) {
		(<SimulationScene>this.scene).scoreRenderer.notifyPlayerId(playerId); //TODO: Unhack
	}

	tickReceived(tickData: TickData) {
		//Apply all existing frameQueue
		while (this.frameQueue.length > 0) {
			this.runNextFrame();
		}

		for (let i = 0; i < tickData.framesElapsed; i++) {
			this.frameQueue.push(tickData.frameData[i]);
		}
		
		//This should really be applied at the end of playing the frameQueue
		if (tickData.points) {
			(<SimulationScene>this.scene).scoreRenderer.updateData(tickData.points); //TODO: Unhack
		}
		if (tickData.playerCount) {
			(<SimulationScene>this.scene).playerCountRenderer.updateData(tickData.playerCount); //TODO: Unhack
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