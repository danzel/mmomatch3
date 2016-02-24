import Detector = require('./detector');
import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LiteEvent = require('../../liteEvent');
import Simulation = require('../simulation');
import VictoryType = require('./victoryType');

import MatchesDetector = require('./Detectors/matchesDetector');
import ScoreDetector = require('./Detectors/scoreDetector');
import TimeDetector = require('./Detectors/timeDetector');


class GameEndDetector {
	
	/** Passes true if the game was won */
	gameEnded = new LiteEvent<boolean>();
	
	failureDetector: Detector;
	victoryDetector: Detector;
	
	gameHasEnded = false;
	private gameEndedInVictory: boolean;

	constructor(private level: LevelDef, private simulation: Simulation) {
		this.failureDetector = this.createFailureDetector();
		this.victoryDetector = this.createVictoryDetector();
		
		this.failureDetector.detected.on(() => this.checkForGameEnd(false));
		this.victoryDetector.detected.on(() => this.checkForGameEnd(true));
	}
	
	private checkForGameEnd(victory: boolean) {
		if (this.gameHasEnded) {
			return;
		}
		
		this.gameHasEnded = true;
		this.gameEndedInVictory = victory;
		
		this.gameEnded.trigger(victory);
		console.log("game end", victory);
	}

	private createFailureDetector(): Detector {
		switch (this.level.failureType) {
			//case FailureType.Swaps:
			//	return new SwapsDetector(this.level.limitValue); //TODO: You get to wait for the swap happen. When this is triggered input should be disabled and we wait until the grid is quiet
			case FailureType.Time:
				return new TimeDetector(this.simulation, this.level.failureValue);
			default:
				throw new Error("Don't know about FailureType " + this.level.failureType + " " + FailureType[this.level.failureType])
		}
	}

	private createVictoryDetector(): Detector {
		switch (this.level.victoryType) {
			case VictoryType.Matches:
				return new MatchesDetector(this.simulation, this.level.victoryValue);
			case VictoryType.Score:
				return new ScoreDetector(this.simulation, this.level.victoryValue);
			default:
				throw new Error("Don't know about VictoryType " + this.level.victoryType + " " + VictoryType[this.level.victoryType]);
		}
	}
}

export = GameEndDetector;