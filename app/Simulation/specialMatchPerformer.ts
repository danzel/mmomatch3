import Grid = require('./grid');
import Match = require('./match');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import MatchPerformer = require('./matchPerformer');
import MatchType = require('./matchType');
import Swap = require('./swap');
import Type = require('./type');

/** Handles the special effects that happen when a matchable of not-normal type is matched/disappeared */
class SpecialMatchPerformer {
	constructor(private grid: Grid, private matchChecker: MatchChecker) {
	}
	
	tryPerformSwapMatch(swap: Swap): Match {
		
		if (swap.left.type == Type.ColorClearWhenSwapped) {
			return this.colorClear(swap.left, swap.right);
		}
		if (swap.right.type == Type.ColorClearWhenSwapped) {
			return this.colorClear(swap.right, swap.left);
		}
		
		return null;
	}
	
	

	/** Triggers any special matchables in the given match */
	applyToMatch(match: Match) {
		let matchables = match.matchables;

		for (let i = 0; i < matchables.length; i++) {
			let m = matchables[i];

			switch (m.type) {
				case Type.Normal:
				case Type.ColorClearWhenSwapped: //This is handled in tryPerformSwapMatch
					break;
				case Type.HorizontalClearWhenMatched:
					this.horizontalClear(m, match);
					break;
				case Type.VerticalClearWhenMatched:
					this.verticalClear(m, match);
					break;
				default:
					throw new Error("Don't know what to do when a Type " + Type[m.type] + " is matched");
			}
		}
	}
	
	private colorClear(colorClear: Matchable, triggered: Matchable): Match {
		let matchingColor = triggered.color;

		let matchables = [colorClear, triggered];
		colorClear.isDisappearing = true;
		triggered.isDisappearing = true;		
		
		//Scan the grid for others that match the color and clear them
		for (let x = 0; x < this.grid.cells.length; x++) {
			let col = this.grid.cells[x];
			for (let y = 0; y < col.length; y++) {
				let m = col[y];
				if (this.matchChecker.matchableIsAbleToMatch(m) && m.color == matchingColor) {
					m.isDisappearing = true;
					matchables.push(m);
				}
			}
		}
		
		return new Match(MatchType.ColorClear, matchables)
	}

	private horizontalClear(source: Matchable, match: Match) {
		for (let x = 0; x < this.grid.width; x++) {
			let hit = this.grid.findMatchableAtPosition(x, source.y);

			if (hit && this.matchChecker.matchableIsAbleToMatch(hit)) {
				hit.isDisappearing = true;
				match.matchables.push(hit);
			}
		}
		match.matchType = MatchType.HorizontalClear;
	}

	private verticalClear(source: Matchable, match: Match) {
		let col = this.grid.cells[source.x];
		for (let y = 0; y < col.length; y++) {
			let hit = col[y];

			if (this.matchChecker.matchableIsAbleToMatch(hit)) {
				hit.isDisappearing = true;
				match.matchables.push(hit);
			}
		}
		match.matchType = MatchType.VerticalClear;
	}
}

export = SpecialMatchPerformer;