import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Language = require('../../../Language');
import Simulation = require('../../simulation');

class ScoreDetector extends Detector {

	scoreRequiredRemaining: number;

	constructor(private simulation: Simulation, public scoreRequired: number) {
		super(GameEndType.LevelVictory);

		this.scoreRequiredRemaining = scoreRequired;

		simulation.scoreTracker.playerEarnedPoints.on(() => this.update());
	}

	update() {
		if (this.scoreRequiredRemaining > 0) {
			this.scoreRequiredRemaining = Math.max(0, this.scoreRequired - this.simulation.scoreTracker.totalPoints);
			this.valueChanged.trigger();

			if (this.scoreRequiredRemaining == 0) {
				this.detected.trigger();
			}
		}
	}

	getDetailsText(): string {
		return Language.t('get x points', { num: this.scoreRequired });
	}
}

export = ScoreDetector;