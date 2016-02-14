import FailureType = require('./failureType');
import VictoryType = require('./victoryType');

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
	
	failureType: FailureType;
	victoryType: VictoryType;
	
	failureValue: any;
	victoryValue: any;
	
	//MaxMoves, Matches Required?, Points Required?, RNG seed?
	
	// Level Types
	// http://candycrush.wikia.com/wiki/Level_Types
	// http://candycrushsoda.wikia.com/wiki/Level_Types
	
	constructor(levelNumber: number, width: number, height: number, holes: Array<XY>, colorCount: number, failureType: FailureType, victoryType: VictoryType, failureValue: any, victoryValue: any) {
		this.levelNumber = levelNumber;
		
		this.width = width;
		this.height = height;
		this.holes = holes;
		
		this.colorCount = colorCount;

		this.failureType = failureType;
		this.victoryType = victoryType;

		this.failureValue = failureValue;
		this.victoryValue = victoryValue;
	}
}

export = LevelDef;