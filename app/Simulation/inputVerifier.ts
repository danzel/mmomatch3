import Color = require('./color');
import Grid = require('./grid');
import MagicNumbers = require('./magicNumbers');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import Type = require('./type');

interface GameEndDetector {
	gameHasEnded: boolean;
}

class InputVerifier {
	
	inputDisabled = false;
	
	constructor(private grid: Grid, private matchChecker: MatchChecker, private requireSwapsToMakeMatches: boolean) {
	}
	
	swapIsValid(left: Matchable, right: Matchable) : boolean {
		if (this.inputDisabled)
			return false;
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
		if (!matchable || !this.matchChecker.matchableIsAbleToSwap(matchable)) {
			return false;
		}
		return true;
	}
	
	private isGoodSwapDirection(left: Matchable, right: Matchable): boolean {
		if (left.x == right.x) { //y swap
			if (left.y == right.y + MagicNumbers.matchableYScale || left.y == right.y - MagicNumbers.matchableYScale)
				return true;
		}
		else if (left.y == right.y) { //x swap
			if (left.x == right.x + 1 || left.x == right.x - 1)
				return true;
		}
		return false;
	}
	
	private swapWillMakeAMatch(left: Matchable, right: Matchable): boolean {
		
		if (this.isExplictlySwappable(left, right)) {
			return true;
		}
		//Swapping and unswapping is sorta hax, but easiest way to do this
		this.grid.swap(left, right);
		var res = this.matchChecker.testForMatch(left) || this.matchChecker.testForMatch(right);
		this.grid.swap(left, right);
		
		if (res) {
			return true;
		}
		
		return false;
	}

	private isExplictlySwappable(left: Matchable, right: Matchable): boolean {
		if (left.type == Type.ColorClearWhenSwapped && right.color != Color.None) {
			return true;
		}
		if (right.type == Type.ColorClearWhenSwapped && left.color != Color.None) {
			return true;
		}
		return false;
	}
	
	private isInt(n: number) : boolean {
		return n === +n && n === (n|0)
	}
}

export = InputVerifier;