import VictoryType = require('./victoryType');
import LimitType = require('./limitType');

interface XY {
	x: number;
	y: number;
};

class LevelDef {
	levelNumber: number;
	
	width: number;
	height: number;
	holes: Array<XY> = [];
	
	colorCount: number;
	
	limitType: LimitType;
	victoryType: VictoryType;
	
	limitValue: any;
	victoryValue: any;
	
	//TODO: MaxMoves, Matches Required?, Points Required?, RNG seed?
	
	// Level TYpes
	// http://candycrush.wikia.com/wiki/Level_Types
	// http://candycrushsoda.wikia.com/wiki/Level_Types
	
	constructor(levelNumber: number, width: number, height: number, holes: Array<XY>, colorCount: number, limitType: LimitType, victoryType: VictoryType, limitValue: any, victoryValue: any) {
		this.levelNumber = levelNumber;
		
		this.width = width;
		this.height = height;
		this.holes = holes;
		
		this.colorCount = colorCount;

		this.limitType = limitType;
		this.victoryType = victoryType;

		this.limitValue = limitValue;
		this.victoryValue = victoryValue;
	}
}

export = LevelDef;