import Color = require('../Simulation/color');
import GridFactory = require('../Simulation/Levels/gridFactory');
import LevelAndSimulationProvider = require('./levelAndSimulationProvider');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDefFactory = require('../Simulation/Levels/levelDefFactory');
import LevelDefFactoryDynamic = require('../Simulation/Levels/levelDefFactoryDynamic');
import MatchableFactory = require('../Simulation/matchableFactory');
import RandomGenerator = require('../Simulation/randomGenerator');
import RequireMatch = require('../Simulation/requireMatch');
import ScoreTracker = require('../Simulation/Scoring/scoreTracker');
import Simulation = require('../Simulation/simulation');
import SpawnOverride = require('../Simulation/spawnOverride');
import SpawningSpawnManager = require('../Simulation/spawningSpawnManager');
import Type = require('../Simulation/type');
import VictoryType = require('../Simulation/Levels/victoryType');

import GetThingsToBottomScoreTracker = require('../Simulation/Scoring/ScoreTrackers/getThingsToBottomScoreTracker');
import PointsScoreTracker = require('../Simulation/Scoring/ScoreTrackers/pointsScoreTracker');
import MatchesScoreTracker = require('../Simulation/Scoring/ScoreTrackers/matchesScoreTracker');
import MatchXOfColorScoreTracker = require('../Simulation/Scoring/ScoreTrackers/matchXOfColorScoreTracker');
import RequireMatchScoreTracker = require('../Simulation/Scoring/ScoreTrackers/requireMatchScoreTracker');


class DefaultLevelAndSimulationProvider implements LevelAndSimulationProvider {
	constructor(private levelDefFactory: LevelDefFactory) {

	}

	loadLevel(levelNumber: number, playerCount?: number): { level: LevelDef, simulation: Simulation } {

		if (playerCount && this.levelDefFactory instanceof LevelDefFactoryDynamic) {
			(<LevelDefFactoryDynamic>this.levelDefFactory).playerCount = playerCount;
		}

		let level = this.levelDefFactory.getLevel(levelNumber);
		let grid = GridFactory.createGrid(level);
		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), level.colorCount);
		let simulation = new Simulation(grid, spawnManager, matchableFactory, 60);

		simulation.scoreTracker = DefaultLevelAndSimulationProvider.createScoreTracker(level, simulation);

		if (level.victoryType == VictoryType.RequireMatch) {
			let requireMatches = <Array<{ x: number, y: number; amount: number }>>level.victoryValue;
			requireMatches.forEach(req => {
				simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(req.x, req.y, req.amount));
			})
		}
		if (level.victoryType == VictoryType.GetThingsToBottom) {
			//grid height is double because initial spawn is off the screen
			spawnManager.spawnOverride = new SpawnOverride(matchableFactory);
			let spawns = <Array<number>>level.victoryValue;
			for (let i = 0; i < spawns.length; i++) {
				spawnManager.spawnOverride.addSpawn(spawns[i], grid.height + grid.height - 1, Color.None, Type.GetToBottom);
			}
		}

		return { level: level, simulation: simulation };
	}

	static createScoreTracker(level: LevelDef, simulation: Simulation): ScoreTracker {
		switch (level.victoryType) {
			case VictoryType.GetThingsToBottom:
				return new GetThingsToBottomScoreTracker(simulation.comboOwnership, simulation.grid, simulation.swapHandler);
			case VictoryType.Matches:
				return new MatchesScoreTracker(simulation.comboOwnership);
			case VictoryType.MatchXOfColor:
				return new MatchXOfColorScoreTracker(simulation.comboOwnership);
			case VictoryType.RequireMatch:
				return new RequireMatchScoreTracker(simulation.requireMatchInCellTracker);
			case VictoryType.Score:
				return new PointsScoreTracker(simulation.comboOwnership);
			default:
				throw new Error("Don't know about the ScoreTracker for victoryType " + level.victoryType + ' ' + VictoryType[level.victoryType]);
		}
	}
}

export = DefaultLevelAndSimulationProvider;