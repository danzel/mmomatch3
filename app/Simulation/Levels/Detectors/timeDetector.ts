import Detector = require('../detector');
import Simulation = require('../../simulation');

class TimeDetector extends Detector {
	
	timeRemaining: number;
	
	constructor(simulation: Simulation, public totalTime: number) {
		super();
		
		this.timeRemaining = totalTime;
		
		simulation.frameCompleted.on(() => {
			if (this.timeRemaining > 0 && simulation.timeRunning >= totalTime) {
				this.detected.trigger();
			}
			
			this.timeRemaining = Math.max(0, this.totalTime - simulation.timeRunning);
			
			this.valueChanged.trigger();
		});
	}
}

export = TimeDetector;