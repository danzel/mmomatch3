import Detector = require('./detector');
import FailureType = require('./failureType');
import GameEndConditions = require('./gameEndConditions');
import LiteEvent = require('../../liteEvent');
import Simulation = require('../simulation');
import VictoryType = require('./victoryType');

import GetThingsToBottomDetector = require('./Detectors/getThingsToBottomDetector');
import MatchesDetector = require('./Detectors/matchesDetector');
import MatchXOfColorDetector = require('./Detectors/matchXOfColorDetector');
import RequireMatchDetector = require('./Detectors/requireMatchDetector');
import ScoreDetector = require('./Detectors/scoreDetector');
import SwapsDetector = require('./Detectors/swapsDetector');
import TimeDetector = require('./Detectors/timeDetector');


class GameEndDetector {

	/** Passes true if the game was won */
	gameEnded = new LiteEvent<boolean>();

	failureDetector: Detector;
	victoryDetector: Detector;

	gameHasEnded = false;
	gameEndedInVictory: boolean;

	constructor(private gameEndConditions: GameEndConditions, private simulation: Simulation) {
		this.failureDetector = this.createFailureDetector();
		this.victoryDetector = this.createVictoryDetector();

		this.failureDetector.detected.on(() => this.checkForGameEnd(false));
		this.victoryDetector.detected.on(() => this.checkForGameEnd(true));

		this.failureDetector.update();
		this.victoryDetector.update();
	}

	private checkForGameEnd(victory: boolean) {
		if (this.gameHasEnded) {
			return;
		}

		this.gameHasEnded = true;
		this.gameEndedInVictory = victory;

		this.simulation.inputVerifier.inputDisabled = true;

		this.gameEnded.trigger(victory);
	}

	private createFailureDetector(): Detector {
		switch (this.gameEndConditions.failureType) {
			case FailureType.Swaps:
				return new SwapsDetector(this.simulation, this.gameEndConditions.failureValue);
			case FailureType.Time:
				return new TimeDetector(this.simulation, this.gameEndConditions.failureValue);
			case FailureType.MatchXOfColor:
				return new MatchXOfColorDetector(this.simulation, false, this.gameEndConditions.failureValue);
			default:
				throw new Error("CFD Don't know about FailureType " + this.gameEndConditions.failureType + " " + FailureType[this.gameEndConditions.failureType])
		}
	}

	private createVictoryDetector(): Detector {
		switch (this.gameEndConditions.victoryType) {
			case VictoryType.Matches:
				return new MatchesDetector(this.simulation, this.gameEndConditions.victoryValue);
			case VictoryType.Score:
				return new ScoreDetector(this.simulation, this.gameEndConditions.victoryValue);
			case VictoryType.RequireMatch:
				return new RequireMatchDetector(this.simulation, this.gameEndConditions.victoryValue);
			case VictoryType.GetThingsToBottom:
				return new GetThingsToBottomDetector(this.simulation, this.gameEndConditions.victoryValue.length);
			case VictoryType.MatchXOfColor:
				return new MatchXOfColorDetector(this.simulation, true, this.gameEndConditions.victoryValue);
			default:
				throw new Error("CVD Don't know about VictoryType " + this.gameEndConditions.victoryType + " " + VictoryType[this.gameEndConditions.victoryType]);
		}
	}
}

export = GameEndDetector;