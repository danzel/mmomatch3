import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactory = require('./levelDefFactory');
import VictoryType = require('./victoryType');


class LevelDefFactoryDebug implements LevelDefFactory {
	debugLevel = true;

	getLevel(levelNumber: number): LevelDef {
		if (this.debugLevel) {
			return new LevelDef(levelNumber, 100, 40, [], 8, FailureType.Time, VictoryType.RequireMatch, 10, [{ x: 4, y: 4, amount: 1 }, { x: 7, y: 4, amount: 1 }]);
		}

		if (levelNumber % 3 == 1) {
			return new LevelDef(levelNumber, 50, 25, [], 8, FailureType.Time, VictoryType.Score, 180, 200 * 1000);
		}
		if (levelNumber % 3 == 2) {
			return new LevelDef(levelNumber, 30, 30, [], 8, FailureType.Swaps, VictoryType.Score, 100, 60 * 1000);
		}
		if (levelNumber % 3 == 0) {
			return new LevelDef(levelNumber, 20, 50, [], 8, FailureType.Time, VictoryType.Score, 180, 200 * 1000);
		}
	}
}

export = LevelDefFactoryDebug;