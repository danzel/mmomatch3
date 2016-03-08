import FailureType = require('./failureType');
import VictoryType = require('./victoryType');

interface GameEndConditions {
	failureType: FailureType;
	victoryType: VictoryType;

	failureValue: any;
	victoryValue: any;
}

export = GameEndConditions;