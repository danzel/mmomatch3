/// <reference path="../typings/phaser/phaser.comments.d.ts" />
/// <reference path="../typings/primus/primusClient.d.ts" />
import Simulation = require('./Simulation/simulation');
import SimulationRenderer = require('./Renderer/simulationRenderer');
import InputHandler = require('./Input/inputHandler');
import InputVerifier = require('./Simulation/inputVerifier');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');
import Serializer = require('./Serializer/simple');

class AppEntry {
	game: Phaser.Game;
	simulation: Simulation;
	renderer: SimulationRenderer;
	input: InputHandler;

	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, null, this, false, true, null);
		this.simulation = new Simulation(50, 20);
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
		let rendererGroup = this.game.add.group();
		this.renderer = new SimulationRenderer(this.game, this.simulation, rendererGroup);
		this.input = new InputHandler(this.game, this.renderer, this.simulation, new SinglePlayerInputApplier(this.simulation.swapHandler, new InputVerifier(this.simulation.grid, this.simulation.swapHandler)));
	}

	update() {

		this.simulation.update(this.game.time.physicsElapsed);
		this.renderer.update(this.game.time.physicsElapsed);
		
		//var data = Serializer.serialize(this.simulation);
		//debugger;
	}
}

//new AppEntry();

let primus = Primus.connect('http://127.0.0.1:8091', {

});

primus.on('open', function(data) { console.log('open', data); });
primus.on('data', function(data) { console.log('data', data); });

setTimeout(function() {
	console.log('sending');
	primus.write('hello world');
}, 2000);