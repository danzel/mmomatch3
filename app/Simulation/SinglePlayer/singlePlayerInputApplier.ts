import Grid = require('../grid');
import InputApplier = require('../inputApplier');
import InputVerifier = require('../inputVerifier');
import Matchable = require('../matchable');
import SwapHandler = require('../swapHandler');

class SinglePlayerInputApplier extends InputApplier {
	private swapHandler: SwapHandler;

	constructor(swapHandler: SwapHandler, inputVerifier: InputVerifier, grid: Grid) {
		super(inputVerifier, grid);

		this.swapHandler = swapHandler;
	}

	protected performSwap(left: Matchable, right: Matchable): void {
		this.swapHandler.swap(0, left, right);
	}
}

export = SinglePlayerInputApplier; 