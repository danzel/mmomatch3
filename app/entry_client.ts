/// <reference path="../typings/phaser/phaser.comments.d.ts" />
/// <reference path="../typings/primus/primusClient.d.ts" />
import Client = require('./Client/client');
import Simulation = require('./Simulation/simulation');
import SimulationRenderer = require('./Renderer/simulationRenderer');
import InputHandler = require('./Input/inputHandler');
import InputVerifier = require('./Simulation/inputVerifier');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');
import Serializer = require('./Serializer/simple');
import TickData = require('./DataPackets/tickData');

class AppEntry {
	client: Client;
	game: Phaser.Game;
	simulation: Simulation;
	renderer: SimulationRenderer;
	input: InputHandler;
	
	framesToProcess: number;

	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, null, this, false, true, null);
		this.framesToProcess = 0;
	}

	preload() {
		console.log("preload");
		this.game.stage.disableVisibilityChange = true;
		
		this.game.load.image('ball_1', 'img/skin/debug/balls/1.png');
		this.game.load.image('ball_2', 'img/skin/debug/balls/2.png');
		this.game.load.image('ball_3', 'img/skin/debug/balls/3.png');
		this.game.load.image('ball_4', 'img/skin/debug/balls/4.png');
		this.game.load.image('ball_5', 'img/skin/debug/balls/5.png');
	}

	create() {
		console.log('create');
		
		this.client = new Client('http://127.0.0.1:8091', new Serializer());
		
		this.client.simulationReceived.on(this.simulationReceived.bind(this));
		this.client.tickReceived.on(this.tickReceived.bind(this));
	}
	
	simulationReceived(simulation: Simulation) {
		this.simulation = simulation;

		let rendererGroup = this.game.add.group();
		this.renderer = new SimulationRenderer(this.game, this.simulation, rendererGroup);
		this.input = new InputHandler(this.game, this.renderer, this.simulation, new SinglePlayerInputApplier(this.simulation.swapHandler, new InputVerifier(this.simulation.grid, this.simulation.swapHandler)));
	}
	
	tickReceived(tickData: TickData) {
		//TODO: Swaps
		this.framesToProcess += tickData.framesElapsed;
	}

	update() {
		if (!this.simulation || this.framesToProcess == 0) {
			return;
		}
		
		while (this.framesToProcess > 0) {
			this.simulation.update(this.game.time.physicsElapsed);
			this.framesToProcess--;
		}
		
		this.renderer.update(this.game.time.physicsElapsed);
	}
}

new AppEntry();