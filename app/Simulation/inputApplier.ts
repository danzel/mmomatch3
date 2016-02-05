import Grid = require('./grid');
import InputVerifier = require('./inputVerifier');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');

interface XY {
	x: number;
	y: number;
}

abstract class InputApplier {

	failedToSwap = new LiteEvent<{ matchable: Matchable, direction: XY }>();

	constructor(private inputVerifier: InputVerifier, private grid: Grid) {
	}

	swapMatchable(left: Matchable, right: Matchable, direction: XY): void {
		if (this.inputVerifier.swapIsValid(left, right)) {
			this.performSwap(left, right);
		} else {
			this.failedToSwap.trigger({ matchable: left, direction });
		}
	}

	protected abstract performSwap(left: Matchable, right: Matchable): void;
}

export = InputApplier;