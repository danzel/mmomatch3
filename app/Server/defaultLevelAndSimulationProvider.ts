import Color = require('../Simulation/color');
import GridFactory = require('../Simulation/Levels/gridFactory');
import LevelAndSimulationProvider = require('./levelAndSimulationProvider');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDefFactory = require('../Simulation/Levels/levelDefFactory');
import MatchableFactory = require('../Simulation/matchableFactory');
import RandomGenerator = require('../Simulation/randomGenerator');
import RequireMatch = require('../Simulation/requireMatch');
import Simulation = require('../Simulation/simulation');
import SpawningSpawnManager = require('../Simulation/spawningSpawnManager');
import Type = require('../Simulation/type');
import VictoryType = require('../Simulation/Levels/victoryType');

class DefaultLevelAndSimulationProvider implements LevelAndSimulationProvider {
	constructor(private levelDefFactory: LevelDefFactory) {

	}

	loadLevel(levelNumber: number): { level: LevelDef, simulation: Simulation } {
		let level = this.levelDefFactory.getLevel(levelNumber);
		let grid = GridFactory.createGrid(level);
		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), level.colorCount);
		let simulation = new Simulation(grid, spawnManager, matchableFactory, 60);

		if (level.victoryType == VictoryType.RequireMatch) {
			let requireMatches = <Array<{ x: number, y: number; amount: number }>>level.victoryValue;
			requireMatches.forEach(req => {
				simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(req.x, req.y, req.amount));
			})
		}
		if (level.victoryType == VictoryType.GetThingToBottom) {
			//grid height is double because initial spawn is off the screen
			matchableFactory.forceSpawn = { x: <number>level.victoryValue, y: grid.height + grid.height - 1, color: Color.None, type: Type.GetToBottom };
		}

		return { level: level, simulation: simulation };
	}
}

export = DefaultLevelAndSimulationProvider;