import IInputApplier = require('../iInputApplier');
import InputVerifier = require('../inputVerifier');
import Simulation = require('../simulation');

class SinglePlayerInputApplier implements IInputApplier {
	private simulation: Simulation;
	private inputVerifier: InputVerifier;
	
	constructor(simulation: Simulation) {
		this.simulation = simulation;
		
		this.inputVerifier = new InputVerifier(simulation);
	}
	
	swapMatchable(x: number, y: number, xTarget: number, yTarget: number) {
		if (this.inputVerifier.swapIsValid(x, y, xTarget, yTarget)) {
			this.simulation.swap(x, y, xTarget, yTarget);
		}
	}
}

export = SinglePlayerInputApplier; 