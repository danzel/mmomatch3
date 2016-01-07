import Grid = require('../grid');
import IInputApplier = require('../iInputApplier');
import InputVerifier = require('../inputVerifier');
import Matchable = require('../matchable');
import SwapHandler = require('../swapHandler');

class SinglePlayerInputApplier implements IInputApplier {
	private swapHandler: SwapHandler;
	private inputVerifier: InputVerifier;
	private grid: Grid;

	constructor(swapHandler: SwapHandler, inputVerifier: InputVerifier, grid: Grid) {
		this.swapHandler = swapHandler;
		this.inputVerifier = inputVerifier;
		this.grid = grid;
	}
	
	swapMatchable(left: Matchable, right: Matchable) {
		if (this.inputVerifier.swapIsValid(left, right)) {
			this.swapHandler.swap(left, right);
		}
	}
}

export = SinglePlayerInputApplier; 