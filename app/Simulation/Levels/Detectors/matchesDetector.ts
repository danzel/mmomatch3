import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Simulation = require('../../simulation');

class MatchesDetector extends Detector {

	matchesRemaining: number;

	constructor(private simulation: Simulation, public totalMatchesRequired: number) {
		super(GameEndType.LevelVictory);

		this.matchesRemaining = totalMatchesRequired;

		simulation.matchPerformer.matchPerformed.on(() => this.update());
	}

	update() {
		if (this.matchesRemaining > 0) {
			this.matchesRemaining = Math.max(0, this.totalMatchesRequired - this.simulation.matchPerformer.totalMatchablesMatched);
			this.valueChanged.trigger();
			if (this.matchesRemaining <= 0) {
				this.detected.trigger();
			}
		}
	}

	getDetailsText(): string {
		return "Match " + this.totalMatchesRequired + " Animals";
	}
}

export = MatchesDetector;