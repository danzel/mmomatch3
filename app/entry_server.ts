import Color = require('./simulation/color');
import Grid = require('./Simulation/grid');
import InputVerifier = require('./Simulation/inputVerifier');
import MatchableFactory = require('./Simulation/matchableFactory');
import RandomGenerator = require('./Simulation/randomGenerator');
import Serializer = require('./Serializer/simple');
import Server = require('./Server/server');
import Simulation = require('./Simulation/simulation');
import SpawningSpawnManager = require('./Simulation/spawningSpawnManager');

class AppEntry {
	simulation: Simulation;
	server: Server;

	fps: number;
	tickRate: number;

	constructor() {
		let grid = new Grid(50, 20);
		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), Color.Max);
		this.simulation = new Simulation(grid, spawnManager, matchableFactory);
		this.server = new Server(this.simulation, new Serializer(), new InputVerifier(this.simulation.grid, this.simulation.matchChecker, true));
	}

	update() {
		this.simulation.update(this.tickRate);
		this.server.update(this.tickRate);
	}

	run(fps: number) {
		this.fps = fps;
		this.tickRate = 1 / fps;

		setInterval(this.update.bind(this), this.tickRate * 1000);
	}

	public static main(): number {
		new AppEntry().run(60);
		return 0;
	}
}

AppEntry.main();