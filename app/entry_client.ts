/// <reference path="../typings/phaser/phaser.comments.d.ts" />
import Client = require('./Client/client');
import ClientInputApplier = require('./Client/clientInputApplier');
import ClientSpawnManager = require('./Client/clientSpawnManager');
import FrameData = require('./DataPackets/frameData');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import PlayerCountRenderer = require('./Renderer/playerCountRenderer');
import ScoreRenderer = require('./Renderer/scoreRenderer');
import Simulation = require('./Simulation/simulation');
import SimulationRenderer = require('./Renderer/simulationRenderer');
import InputHandler = require('./Input/inputHandler');
import InputVerifier = require('./Simulation/inputVerifier');
import Serializer = require('./Serializer/simple');
import TickData = require('./DataPackets/tickData');

class AppEntry {
	client: Client;
	game: Phaser.Game;
	simulation: Simulation;
	renderer: SimulationRenderer;
	scoreRenderer: ScoreRenderer;
	playerCountRenderer: PlayerCountRenderer;
	input: InputHandler;

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

	simulationReceived(simulation: Simulation) {
		this.simulation = simulation;

		this.renderer = new SimulationRenderer(this.game, this.simulation, this.game.add.group());
		this.scoreRenderer = new ScoreRenderer(this.game.add.group());
		this.playerCountRenderer = new PlayerCountRenderer(this.game.add.group());
		this.input = new InputHandler(this.game, this.renderer, this.simulation, new ClientInputApplier(this.client, new InputVerifier(this.simulation.grid, simulation.matchChecker, true), this.simulation.grid));
	}
	
	playerIdReceived(playerId: number) {
		this.scoreRenderer.notifyPlayerId(playerId);
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
			this.scoreRenderer.updateData(tickData.points);
		}
		if (tickData.playerCount) {
			this.playerCountRenderer.updateData(tickData.playerCount);
		}
	}

	update() {
		if (this.frameQueue.length == 0) {
			return;
		}

		this.runNextFrame();

		this.renderer.update(this.game.time.physicsElapsed);
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

		this.simulation.update(1.0 / 60);
	}
}

new AppEntry();