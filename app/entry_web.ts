/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />
import Simulation = require('./Simulation/simulation');
import SimulationRenderer = require('./Renderer/simulationRenderer');
import InputHandler = require('./Input/inputHandler');
import InputVerifier = require('./Simulation/inputVerifier');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');

class AppEntry {
	game: Phaser.Game;
	simulation: Simulation;
	renderer: SimulationRenderer;
	input: InputHandler;

	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, null, this, false, true, null);
		this.simulation = new Simulation();
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

/*
		let ball = this.game.add.image(60, 60, 'ball_1');
		ball.anchor = new Phaser.Point(0.5, 0.5);
		ball.rotation = Math.PI / 2;

		this.game.add.tween(ball).to({ x: 160 }, 1000, Phaser.Easing.Cubic.InOut, true, 0, 0, false);
*/		//ball.alpha = 0.5;
	}

	update() {
		
		this.simulation.update(this.game.time.physicsElapsed);
		this.renderer.update(this.game.time.physicsElapsed);
	}
}

new AppEntry();