import FailureType = require('../../../Simulation/Levels/failureType');
import GameEndType = require('../../../Simulation/Levels/gameEndType');
import VictoryType = require('../../../Simulation/Levels/victoryType');

interface LevelModel {
	levelNumber: number;
	width: number;
	height: number;
	colorCount: number;
	failureType: FailureType;
	victoryType: VictoryType;

	/** JSON Encoded */
	failureValue: string;
	/** JSON Encoded */
	victoryValue: string;

	gameEndType: GameEndType;
};

export = LevelModel;