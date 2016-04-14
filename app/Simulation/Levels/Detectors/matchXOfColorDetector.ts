import Color = require('../../color');
import Detector = require('../detector');
import Simulation = require('../../simulation');

class MatchXOfColorDetector extends Detector {
	
	matchesRemaining: number;
	constructor(private simulation: Simulation, private isVictory: boolean, public config: { color: Color, amount: number }) {
		super();
		this.matchesRemaining = config.amount;
		
		simulation.simulationStats.matchesByColorUpdated.on(() => this.update());
	}

	update() {
		if (this.matchesRemaining > 0) {
			this.matchesRemaining = Math.max(0, this.config.amount - this.simulation.simulationStats.matchesByColor[this.config.color]);
			this.valueChanged.trigger();
			if (this.matchesRemaining <= 0) {
				this.detected.trigger();
			}
		}
	}

	getDetailsText(): string {
		let res = "Match " + this.config.amount + " " + this.getColorText();
		
		if (this.isVictory) {
			return res;
		}
		
		return "Don't " + res;
	}
	
	getColorText(): string {
		return (this.config.color == 3 ? "Pugs" : "Pigs")
	}
}

export = MatchXOfColorDetector;