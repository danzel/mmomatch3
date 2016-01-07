import Matchable = require('./matchable');

interface IInputApplier {
	swapMatchable(left: Matchable, right: Matchable): void;
}

export = IInputApplier;