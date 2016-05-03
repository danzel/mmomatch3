import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import RequireMatch = require('../../requireMatch');
import Simulation = require('../../simulation');


class RequireMatchDetector extends Detector {
	requireMatches: number;
	totalRequireMatches: number;
	
	constructor(private simulation: Simulation, requireMatches: Array<any>) {
		super(GameEndType.LevelVictory);

		this.totalRequireMatches = requireMatches.length;
		
		simulation.requireMatchInCellTracker.requirementMet.on(() => this.requirementMet());
	}
	
	private requirementMet() {
		this.update();
	}
	
	update() {
		this.requireMatches = this.simulation.requireMatchInCellTracker.requirements.length;
		this.valueChanged.trigger();

		if (this.simulation.requireMatchInCellTracker.requirements.length == 0) {
			this.detected.trigger();
		}
	}

	getDetailsText(): string {
		return "Rescue the animals from their cages";
	}
}

export = RequireMatchDetector;