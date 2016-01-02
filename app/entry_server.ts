/// <reference path="../typings/node/node.d.ts" />
import InputVerifier = require('./Simulation/inputVerifier');
import Server = require('./Server/server');
import Simulation = require('./Simulation/simulation');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');
import Serializer = require('./Serializer/simple');

class AppEntry {
	simulation: Simulation;
	server: Server;
	
	fps: number;
	tickRate: number;

	constructor() {
		this.simulation = new Simulation(50, 20);
		this.server = new Server();
	}
	
	update() {
		//console.log('tick');
		this.simulation.update(this.tickRate);
		this.server.update(this.tickRate);
	}
	
	run(fps: number) {
		this.fps = fps;
		this.tickRate = 1 / fps;
		
		setInterval(this.update.bind(this), this.tickRate * 1000);
	}
	
	public static main(): number {
		new AppEntry().run(1);
		return 0;
	}
}

AppEntry.main();