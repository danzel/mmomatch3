import Grid = require('./grid');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import SwapHandler = require('./swapHandler');

class InputVerifier {
	private grid: Grid;
	private matchChecker: MatchChecker;
	private requireSwapsToMakeMatches: boolean;
	
	constructor(grid: Grid, matchChecker: MatchChecker, requireSwapsToMakeMatches: boolean) {
		this.grid = grid;
		this.matchChecker = matchChecker;
		this.requireSwapsToMakeMatches = requireSwapsToMakeMatches;
	}
	
	swapIsValid(left: Matchable, right: Matchable) : boolean {
		if (!this.inValidState(left))
			return false;
		if (!this.inValidState(right))
			return false;
		
		if (!this.isGoodSwapDirection(left, right))
			return false;
		
		//Check if a swap actually causes a match
		if (this.requireSwapsToMakeMatches) {
			if (!this.swapWillMakeAMatch(left, right)) {
				return false;
			}
		}
		return true;
	}
	
	private inValidState(matchable: Matchable) : boolean {
		if (!matchable || matchable.isMoving || matchable.isDisappearing || matchable.beingSwapped) {
			return false;
		}
		return true;
	}
	
	private isGoodSwapDirection(left: Matchable, right: Matchable): boolean {
		if (left.x == right.x) { //y swap
			if (left.y == right.y + 1 || left.y == right.y - 1)
				return true;
		}
		else if (left.y == right.y) { //x swap
			if (left.x == right.x + 1 || left.x == right.x - 1)
				return true;
		}
		return false;
	}
	

	private swapWillMakeAMatch(left: Matchable, right: Matchable): boolean {
		
		//Swapping and unswapping is sorta hax, but easiest way to do this
		this.grid.swap(left, right);
		var res = this.matchChecker.testForMatch(left) || this.matchChecker.testForMatch(right);
		this.grid.swap(left, right);
		
		if (res) {
			return true;
		}
		
		//TODO: Show visually when you fail to swap because of this
		return false;
	}
	
	private isInt(n: number) : boolean {
		return n === +n && n === (n|0)
	}
}

export = InputVerifier;