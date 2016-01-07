import Grid = require('./grid');
import Matchable = require('./matchable');
import SwapHandler = require('./swapHandler');

class InputVerifier {
	private grid: Grid;
	
	constructor(grid: Grid) {
		this.grid = grid;
	}
	
	swapIsValid(left: Matchable, right: Matchable) : boolean {
		if (!this.inValidState(left))
			return false;
		if (!this.inValidState(right))
			return false;
		
		if (left.x == right.x) { //y swap
			if (left.y == right.y + 1 || left.y == right.y - 1)
				return true;
		}
		else if (left.y == right.y) { //x swap
			if (left.x == right.x + 1 || left.x == right.x - 1)
				return true;
		}
		
		//TODO: Check if a swap actually causes a match?
		
		return false;
	}
	
	private inValidState(matchable: Matchable) : boolean {
		if (!matchable || matchable.isMoving || matchable.isDisappearing || matchable.beingSwapped) {
			return false;
		}
		return true;
	}
	
	private isInt(n: number) : boolean {
		return n === +n && n === (n|0)
	}
}

export = InputVerifier;