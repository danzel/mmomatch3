import GridFactory = require('../Simulation/Levels/gridFactory');
import LevelAndSimulationProvider = require('./levelAndSimulationProvider');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDefFactory = require('../Simulation/Levels/levelDefFactory');
import MatchableFactory = require('../Simulation/matchableFactory');
import RandomGenerator = require('../Simulation/randomGenerator');
import Simulation = require('../Simulation/simulation');
import SpawningSpawnManager = require('../Simulation/spawningSpawnManager');

class DefaultLevelAndSimulationProvider implements LevelAndSimulationProvider {
	constructor(private levelDefFactory: LevelDefFactory) {

	}

	loadLevel(levelNumber: number): { level: LevelDef, simulation: Simulation } {
		let level = new LevelDefFactory().getLevel(levelNumber);
		let grid = GridFactory.createGrid(level);
		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), level.colorCount);
		let simulation = new Simulation(grid, spawnManager, matchableFactory);

		return { level: level, simulation: simulation };
	}
}

export = DefaultLevelAndSimulationProvider;