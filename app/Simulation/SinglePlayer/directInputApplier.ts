import Grid = require('../grid');
import InputApplier = require('../inputApplier');
import InputVerifier = require('../inputVerifier');
import Matchable = require('../matchable');
import SwapHandler = require('../swapHandler');

class DirectInputApplier extends InputApplier {
	constructor(private playerId: number, private swapHandler: SwapHandler, inputVerifier: InputVerifier, grid: Grid) {
		super(inputVerifier, grid);
	}

	protected performSwap(left: Matchable, right: Matchable): void {
		this.swapHandler.swap(this.playerId, left, right);
	}
}

export = DirectInputApplier; 