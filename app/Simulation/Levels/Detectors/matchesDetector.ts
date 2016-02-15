import Detector = require('../detector');
import Simulation = require('../../simulation');

class MatchesDetector extends Detector {
	
	matchesRemaining: number;
	
	constructor(simulation: Simulation, public totalMatchesRequired: number) {
		super();
		
		this.matchesRemaining = totalMatchesRequired;
		
		simulation.matchPerformer.matchPerformed.on((data) => {
			if (this.matchesRemaining > 0) {
				this.matchesRemaining -= data.length;
				this.valueChanged.trigger();
				if (this.matchesRemaining <= 0) {
					this.detected.trigger();
				}
			}
		});
	}
}

export = MatchesDetector;