import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactory = require('./levelDefFactory');
import VictoryType = require('./victoryType');


class LevelDefFactoryDebug implements LevelDefFactory {
	getLevel(levelNumber: number): LevelDef {
		
		//Pigs vs Pugs (Pigs)
		//return new LevelDef(levelNumber, 12, 12, [], 6, FailureType.MatchXOfColor, VictoryType.MatchXOfColor, { color: 3, amount: 3 }, { color: 5, amount: 3 });
		//Pigs vs Pugs (Pugs)
		//return new LevelDef(levelNumber, 12, 12, [], 6, FailureType.MatchXOfColor, VictoryType.MatchXOfColor, { color: 5, amount: 3 }, { color: 3, amount: 3 });
		
		//GetThingsToBottom	
		//return new LevelDef(levelNumber, 12, 4, [], 4, FailureType.Time, VictoryType.GetThingsToBottom, 100, [4, 5, 8, 10]);
		
		//Require Match
		return new LevelDef(levelNumber, 20, 20, [], 8, FailureType.Time, VictoryType.RequireMatch, 100, [{ x: 4, y: 4, amount: 1 }, { x: 7, y: 4, amount: 1 }]);
	}
}

export = LevelDefFactoryDebug;