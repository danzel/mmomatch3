/// <reference path="../typings/phaser/phaser.comments.d.ts" />
/// <reference path="../typings/primus/primusClient.d.ts" />
import Client = require('./Client/client');
import ClientInputApplier = require('./Client/clientInputApplier');
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
	input: InputHandler;

	needsRendererUpdate: boolean;
	
	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, null, this, false, true, null);
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
		this.input = new InputHandler(this.game, this.renderer, this.simulation, new ClientInputApplier(this.client, new InputVerifier(this.simulation.grid, this.simulation.swapHandler), this.simulation.grid));
		
		this.needsRendererUpdate = true;
	}
	
	tickReceived(tickData: TickData) {
		//Swaps
		for (let i = 0; i < tickData.swaps.length; i++) {
			var swap = tickData.swaps[i];
			var leftPos = this.simulation.grid.findMatchableId(swap.leftId) 
			var rightPos = this.simulation.grid.findMatchableId(swap.rightId)
			 
			this.simulation.swapHandler.swap(leftPos.x, leftPos.y, rightPos.x, rightPos.y);
		}
		
		//Run the sim
		let framesToProcess = tickData.framesElapsed;
		while (framesToProcess > 0) {
			this.simulation.update(1.0 / 60);
			framesToProcess--;
		}
		
		this.needsRendererUpdate = true;
	}

	update() {
		if (this.needsRendererUpdate) {
			this.renderer.update(this.game.time.physicsElapsed);
			this.needsRendererUpdate = true;
		}
	}
}

new AppEntry();