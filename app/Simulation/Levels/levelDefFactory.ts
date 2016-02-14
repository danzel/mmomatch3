import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import VictoryType = require('./victoryType');

class LevelDefFactory {
	
	
	getLevel(levelNumber: number): LevelDef {
		return new LevelDef(levelNumber, 10, 10, [], 8, FailureType.Time, VictoryType.Matches, 10, 31);
	}
}

export = LevelDefFactory;