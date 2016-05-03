import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Simulation = require('../../simulation');

class TimeDetector extends Detector {

	timeRemaining: number;

	constructor(private simulation: Simulation, public totalTime: number) {
		super(GameEndType.LevelFailure);

		this.timeRemaining = totalTime;

		simulation.frameCompleted.on(() => this.update());
	}

	update() {
		if (this.timeRemaining > 0) {
			this.timeRemaining = Math.max(0, this.totalTime - this.simulation.timeRunning);
			if (this.timeRemaining == 0) {
				this.detected.trigger();
			}
			this.valueChanged.trigger();
		}
	}

	getDetailsText(): string {
		return "within " + this.totalTime + " Seconds";
	}
}

export = TimeDetector;