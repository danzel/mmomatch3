/// <reference path="../typings/phaser/phaser.comments.d.ts" />
/// <reference path="../typings/primus/primusClient.d.ts" />
import Client = require('./Client/client');
import Simulation = require('./Simulation/simulation');
import SimulationRenderer = require('./Renderer/simulationRenderer');
import InputHandler = require('./Input/inputHandler');
import InputVerifier = require('./Simulation/inputVerifier');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');
import Serializer = require('./Serializer/simple');

class AppEntry {
	client: Client;
	game: Phaser.Game;
	simulation: Simulation;
	renderer: SimulationRenderer;
	input: InputHandler;

	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
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
	}
	
	simulationReceived(simulation: Simulation) {
		this.simulation = simulation;

		let rendererGroup = this.game.add.group();
		this.renderer = new SimulationRenderer(this.game, this.simulation, rendererGroup);
		this.input = new InputHandler(this.game, this.renderer, this.simulation, new SinglePlayerInputApplier(this.simulation.swapHandler, new InputVerifier(this.simulation.grid, this.simulation.swapHandler)));
	}

	update() {

		if (!this.simulation) {
			return;
		}
		//TODO: Don't update unless the server says we can
		this.simulation.update(this.game.time.physicsElapsed);
		this.renderer.update(this.game.time.physicsElapsed);
	}
}

new AppEntry();