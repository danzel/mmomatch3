import Color = require('../../color');
import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Language = require('../../../Language');
import Simulation = require('../../simulation');

class MatchXOfColorDetector extends Detector {
	
	matchesRemaining: number;
	constructor(private simulation: Simulation, public isVictory: boolean, public config: { color: Color, amount: number }) {
		super(isVictory ? GameEndType.TeamVictory : GameEndType.TeamDefeat);
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
		return 'unused';
	}
	
	isPugs(): boolean {
		return this.config.color == 3; 
	}
	
	getColorText(): string {
		return (this.isPugs() ? Language.t('pugs') : Language.t('pigs'))
	}
}

export = MatchXOfColorDetector;