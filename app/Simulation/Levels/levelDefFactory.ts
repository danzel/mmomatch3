import LevelDef = require('./levelDef');
import LimitType = require('./limitType');
import VictoryType = require('./victoryType');

class LevelDefFactory {
	
	
	getLevel(levelNumber: number): LevelDef {
		return new LevelDef(levelNumber, 10, 10, [], 8, LimitType.Time, VictoryType.Matches, 10, 31);
	}
}

export = LevelDefFactory;