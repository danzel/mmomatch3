import VictoryType = require('./victoryType');
import LimitType = require('./limitType');

interface XY {
	x: number;
	y: number;
};

class LevelDef {
	width: number;
	height: number;

	holes: Array<XY> = [];
	
	limitType: LimitType;
	victoryType: VictoryType;
	
	limitValue: any;
	victoryValue: any;
	
	//TODO: MaxMoves, Matches Required?, Points Required?, RNG seed?
	
	// Level TYpes
	// http://candycrush.wikia.com/wiki/Level_Types
	// http://candycrushsoda.wikia.com/wiki/Level_Types
	
	constructor(width: number, height: number, holes: Array<XY>, limitType: LimitType, victoryType: VictoryType, limitValue: any, victoryValue: any) {
		this.width = width;
		this.height = height;
		this.holes = holes;

		this.limitType = limitType;
		this.victoryType = victoryType;

		this.limitValue = limitValue;
		this.victoryValue = victoryValue;
	}
}

export = LevelDef;