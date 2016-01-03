/// <reference path="../typings/node/node.d.ts" />
import InputVerifier = require('./Simulation/inputVerifier');
import Server = require('./Server/server');
import Grid = require('./Simulation/grid');
import Simulation = require('./Simulation/simulation');
import SpawnManager = require('./Simulation/spawnManager');
import Serializer = require('./Serializer/simple');

class AppEntry {
	simulation: Simulation;
	server: Server;
	
	fps: number;
	tickRate: number;

	constructor() {
		let grid = new Grid(50, 20);
		let spawnManager = new SpawnManager(grid);
		this.simulation = new Simulation(grid, spawnManager);
		this.server = new Server(this.simulation, new Serializer(), new InputVerifier(this.simulation.grid, this.simulation.swapHandler));
	}
	
	update() {
		//console.log('tick');
		this.simulation.update(this.tickRate);
		this.server.update(this.tickRate);
	}
	
	run(fps: number) {
		this.fps = fps;
		this.tickRate = 1 / fps;
		
		setInterval(this.update.bind(this), this.tickRate * 1000);//this.tickRate * 1000);
	}
	
	public static main(): number {
		new AppEntry().run(60);
		return 0;
	}
}

AppEntry.main();