import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import VictoryType = require('./victoryType');

class LevelDefFactory {

	debugLevel = false;

	getLevel(levelNumber: number): LevelDef {
		if (this.debugLevel) {
			let level = new LevelDef(levelNumber, 10, 10, [], 8, FailureType.Time, VictoryType.Matches, 10, 31);
			level.requireMatches.push({x: 4, y: 4, amount: 1});
			return level;
		}
		
		if (levelNumber % 3 == 0) {
			return new LevelDef(levelNumber, 20, 50, [], 8, FailureType.Time, VictoryType.Score, 180, 200 * 1000);
		}
		if (levelNumber % 3 == 1) {
			return new LevelDef(levelNumber, 50, 25, [], 8, FailureType.Time, VictoryType.Score, 180, 200 * 1000);
		}
		if (levelNumber % 3 == 2) {
			return new LevelDef(levelNumber, 30, 30, [], 8, FailureType.Swaps, VictoryType.Score, 100, 60 * 1000);
		}
	}
}

export = LevelDefFactory;