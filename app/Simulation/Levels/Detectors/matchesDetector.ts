import Detector = require('../detector');
import Simulation = require('../../simulation');

class MatchesDetector extends Detector {
	
	matchesRemaining: number;
	
	constructor(simulation: Simulation, public totalMatchesRequired: number) {
		super();
		
		this.matchesRemaining = totalMatchesRequired;
		
		simulation.matchPerformer.matchPerformed.on((match) => {
			if (this.matchesRemaining > 0) {
				this.matchesRemaining = Math.max(0, this.matchesRemaining - match.matchables.length);
				this.valueChanged.trigger();
				if (this.matchesRemaining <= 0) {
					this.detected.trigger();
				}
			}
		});
	}

	update() {
		
	}
	
	getDetailsText(): string {
		return "Match " + this.totalMatchesRequired + " {Thingies???}"; //TODO: Thingies
	}
}

export = MatchesDetector;