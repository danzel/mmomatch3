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
	
	colorClearRange = 10;
	lineClearRange = 10;
	
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
				case Type.GetToBottom: //Do nothing
					break;
				case Type.HorizontalClearWhenMatched:
					this.horizontalClear(m, match);
					break;
				case Type.VerticalClearWhenMatched:
					this.verticalClear(m, match);
					break;
				case Type.AreaClear3x3WhenMatched:
					this.areaClear3x3(m, match);
					break;
				default:
					throw new Error("Don't know what to do when a Type " + Type[m.type] + " is matched");
			}
		}
	}
	
	private distanceLessThanOrEqual(a: Matchable, b: Matchable, maxDistance: number): boolean {
		let x = a.x - b.x;
		let y = a.y - b.y;
		
		let distSquared = x * x + y * y;
		return distSquared <= maxDistance * maxDistance;
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
				if (this.matchChecker.matchableIsAbleToMatch(m) && m.color == matchingColor && this.distanceLessThanOrEqual(colorClear, m, this.colorClearRange)) {
					m.isDisappearing = true;
					matchables.push(m);
				}
			}
		}
		
		return new Match(MatchType.ColorClear, matchables)
	}

	private horizontalClear(source: Matchable, match: Match) {
		for (let x = Math.max(0, source.x - this.lineClearRange); x < Math.min(source.x + this.lineClearRange, this.grid.width); x++) {
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
		for (let y = Math.max(0, source.y - this.lineClearRange); y < Math.min(col.length, source.y + this.lineClearRange); y++) {
			let hit = col[y];

			if (this.matchChecker.matchableIsAbleToMatch(hit)) {
				hit.isDisappearing = true;
				match.matchables.push(hit);
			}
		}
		match.matchType = MatchType.VerticalClear;
	}
	
	private areaClear3x3(source: Matchable, match: Match) {
		let startX = Math.max(0, source.x - 1);
		let maxX = Math.min(this.grid.width, source.x + 2);
		let startY = Math.max(0, source.y - 1);
		let maxY = Math.min(this.grid.height, source.y + 2);
		
		for (let x = startX; x < maxX; x++) {
			for (let y = startY; y < maxY; y++) {
				let m = this.grid.findMatchableAtPosition(x, y);
				if (m != null && this.matchChecker.matchableIsAbleToMatch(m)) {
					m.isDisappearing = true;
					match.matchables.push(m);
				}
			}
		}
		
		match.matchType = MatchType.AreaClear3x3;
	}
}

export = SpecialMatchPerformer;