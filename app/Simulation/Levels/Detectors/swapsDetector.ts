import Detector = require('../detector');
import Simulation = require('../../simulation');

class SwapsDetector extends Detector {
	
	swapsRemaining: number;
	
	constructor(simulation: Simulation, public totalSwaps: number) {
		super();
		
		this.swapsRemaining = totalSwaps;
		
		simulation.swapHandler.swapStarted.on(() => {
			this.swapsRemaining--;
			this.valueChanged.trigger();
			if (this.swapsRemaining == 0) {
				simulation.inputVerifier.inputDisabled = true;
				
				simulation.quietColumnDetector.gridBecameQuiet.on(() => {
					this.detected.trigger();
				});
			}
		});
	}

	update() {
	}
	
	getDetailsText(): string {
		return "Within " + this.totalSwaps + " Moves";
	}
}

export = SwapsDetector;