import FailureType = require('./failureType');
import GameEndConditions = require('./gameEndConditions');
import VictoryType = require('./victoryType');

interface XY {
	x: number;
	y: number;
};

class LevelDef implements GameEndConditions {
	//MaxMoves, Matches Required?, Points Required?, RNG seed?

	// Level Types
	// http://candycrush.wikia.com/wiki/Level_Types
	// http://candycrushsoda.wikia.com/wiki/Level_Types
	
	/** Any extra details about this level, level generators should populate it with values that fed in to the generation */
	extraData: any;

	constructor(
		public levelNumber: number,
		public width: number,
		public height: number,
		public holes: Array<XY>,
		public colorCount: number,
		public failureType: FailureType,
		public victoryType: VictoryType,
		public failureValue: any,
		public victoryValue: any) {
	}
}

export = LevelDef;