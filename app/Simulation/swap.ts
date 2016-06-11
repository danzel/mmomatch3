import Matchable = require('./matchable');

class Swap {
	
	playerId: number;
	
	left: Matchable;
	right: Matchable
	
	ticks: number;
	
	constructor(playerId: number, left: Matchable, right: Matchable) {
		this.playerId = playerId;
		
		this.left = left;
		this.right = right;

		this.ticks = 0;
	}
}

export = Swap;