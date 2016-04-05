import Detector = require('../detector');
import RequireMatch = require('../../requireMatch');
import Simulation = require('../../simulation');


class RequireMatchDetector extends Detector {
	requireMatches: number;
	totalRequireMatches: number;
	
	constructor(private simulation: Simulation, requireMatches: Array<any>) {
		super();

		this.totalRequireMatches = requireMatches.length;
		
		simulation.requireMatchInCellTracker.requirementMet.on((req) => this.requirementMet(req));
	}
	
	private requirementMet(req: RequireMatch) {
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
		return "Collect all of the presents";
	}
}

export = RequireMatchDetector;