import Detector = require('../detector');
import Simulation = require('../../simulation');

class ScoreDetector extends Detector {
	
	scoreRequiredRemaining: number;
	
	constructor(simulation: Simulation, public scoreRequired: number) {
		super();

this.scoreRequiredRemaining = scoreRequired;

		simulation.scoreTracker.playerEarnedPoints.on(() => {
			if (this.scoreRequiredRemaining > 0) {
				this.scoreRequiredRemaining = Math.max(0, scoreRequired - simulation.scoreTracker.totalPoints);
				this.valueChanged.trigger();
				
				if (this.scoreRequiredRemaining == 0) {
					this.detected.trigger();
				}
			}
		});
	}
}

export = ScoreDetector;