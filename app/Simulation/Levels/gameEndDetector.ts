import Detector = require('./detector');
import LevelDef = require('./levelDef');
import LimitType = require('./limitType');
import LiteEvent = require('../../liteEvent');
import Simulation = require('../simulation');
import VictoryType = require('./victoryType');

import MatchesDetector = require('./Detectors/matchesDetector');
import TimeDetector = require('./Detectors/timeDetector');


class GameEndDetector {
	
	/** True if the game was won */
	gameEnded = new LiteEvent<boolean>();
	
	limitDetector: Detector;
	victoryDetector: Detector;

	constructor(private level: LevelDef, private simulation: Simulation) {
		this.limitDetector = this.createLimitDetector();
		this.victoryDetector = this.createVictoryDetector();
	}

	private createLimitDetector(): Detector {
		switch (this.level.limitType) {
			//case LimitType.Swaps:
			//	return new SwapsDetector(this.level.limitValue); //TODO: You get to wait for the swap happen. When this is triggered input should be disabled and we wait until the grid is quiet
			case LimitType.Time:
				return new TimeDetector(this.simulation, this.level.limitValue);
			default:
				throw new Error("Don't know about LimitType " + this.level.limitType + " " + LimitType[this.level.limitType])
		}
	}

	private createVictoryDetector(): Detector {
		switch (this.level.victoryType) {
			case VictoryType.Matches:
				return new MatchesDetector(this.simulation, this.level.victoryValue);
			default:
				throw new Error("Don't know about VictoryType " + this.level.victoryType + " " + VictoryType[this.level.victoryType]);
		}
	}
}

export = GameEndDetector;