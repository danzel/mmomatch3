import Color = require('./Simulation/color');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import Grid = require('./Simulation/grid');
import GridFactory = require('./Simulation/Levels/gridFactory');
import InputVerifier = require('./Simulation/inputVerifier');
import LevelDefFactory = require('./Simulation/Levels/levelDefFactory');
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

		let level = new LevelDefFactory().getLevel(0);
		let grid = GridFactory.createGrid(level);
		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), Color.Max);
		this.simulation = new Simulation(grid, spawnManager, matchableFactory);
		let gameEndDetector = new GameEndDetector(level, this.simulation);
		this.server = new Server(level, this.simulation, new Serializer(), new InputVerifier(this.simulation.grid, this.simulation.matchChecker, gameEndDetector, true));
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