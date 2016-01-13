import Matchable = require('./matchable');

class Swap {
	
	playerId: number;
	
	left: Matchable;
	right: Matchable
	
	time: number;
	percent: number;
	
	constructor(playerId: number, left: Matchable, right: Matchable) {
		this.playerId = playerId;
		
		this.left = left;
		this.right = right;

		this.time = 0;
	}
}

export = Swap;