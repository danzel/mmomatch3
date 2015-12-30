import IInputApplier = require('../iInputApplier');
import InputVerifier = require('../inputVerifier');
import SwapHandler = require('../swapHandler');

class SinglePlayerInputApplier implements IInputApplier {
	private swapHandler: SwapHandler;
	private inputVerifier: InputVerifier;
	
	constructor(swapHandler: SwapHandler, inputVerifier: InputVerifier) {
		this.swapHandler = swapHandler;
		this.inputVerifier = inputVerifier;
	}
	
	swapMatchable(x: number, y: number, xTarget: number, yTarget: number) {
		if (this.inputVerifier.swapIsValid(x, y, xTarget, yTarget)) {
			this.swapHandler.swap(x, y, xTarget, yTarget);
		}
	}
}

export = SinglePlayerInputApplier; 