import Matchable = require('./matchable');

class Swap {
	left: Matchable;
	right: Matchable
	
	time: number;
	percent: number;
	
	constructor(left: Matchable, right: Matchable) {
		this.left = left;
		this.right = right;

		this.time = 0;
	}
}

export = Swap;