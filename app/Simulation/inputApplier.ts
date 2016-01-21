import Matchable = require('./matchable');

interface InputApplier {
	swapMatchable(left: Matchable, right: Matchable): void;
}

export = InputApplier;