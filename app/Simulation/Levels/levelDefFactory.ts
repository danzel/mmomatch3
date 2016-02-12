import LevelDef = require('./levelDef');
import LimitType = require('./limitType');
import VictoryType = require('./victoryType');

class LevelDefFactory {
	
	
	getLevel(levelNumber: number): LevelDef {
		return new LevelDef(levelNumber, 10, 10, [], 8, LimitType.swaps, VictoryType.matches, 10, 31);
	}
}

export = LevelDefFactory;