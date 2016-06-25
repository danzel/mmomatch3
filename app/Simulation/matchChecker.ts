import Color = require('./color');
import Grid = require('./grid');
import MagicNumbers = require('./magicNumbers');
import Matchable = require('./matchable');
import Type = require('./type');

class MatchDetails {
	horizontal: boolean;
	vertical: boolean;

	constructor(horizontal: boolean, vertical: boolean) {
		this.horizontal = horizontal;
		this.vertical = vertical;
	}
}

class MatchChecker {
	public static MinimumSizeToMatch = 3;

	constructor(private grid: Grid) {
	}

	/** Returns null if there is no match */
	testForMatch(matchable: Matchable, skipGetToBottom: boolean): MatchDetails {

		//Horizontal Test
		let xSame = 1;
		this.scanLeft(matchable, () => xSame++);
		this.scanRight(matchable, () => xSame++);

		//Vertical Test
		let ySame = 1;
		this.scanDown(matchable, () => ySame++);
		this.scanUp(matchable, () => ySame++);

		if (xSame >= MatchChecker.MinimumSizeToMatch || ySame >= MatchChecker.MinimumSizeToMatch) {
			return new MatchDetails(xSame >= MatchChecker.MinimumSizeToMatch, ySame >= MatchChecker.MinimumSizeToMatch);
		}

		//Special Case: Matchable is a robot at the bottom
		if (!skipGetToBottom && matchable.y == 0 && matchable.type == Type.GetToBottom) {
			return new MatchDetails(false, false);
		}

		return null;
	}

	matchableIsAbleToSwap(matchable: Matchable) {
		if (matchable.isDisappearing)
			return false;
		if (matchable.isMoving)
			return false;
		if (matchable.beingSwapped)
			return false;
		return true;
	}

	/** Not moving, disappearing, being swapped */
	matchableIsAbleToMatch(matchable: Matchable) {
		if (!this.matchableIsAbleToSwap(matchable))
			return false;
		if (matchable.type == Type.GetToBottom)
			return false;
		return true;
	}

	private matches(a: Matchable, b: Matchable): boolean {
		if (!a || !b)
			return false;

		if (a.color == Color.None || b.color == Color.None)
			return false;
		if (a.color != b.color)
			return false;

		if (!this.matchableIsAbleToMatch(a))
			return false;
		if (!this.matchableIsAbleToMatch(b))
			return false;

		return true;
	}

	scanLeft(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let x = matchable.x - 1; x >= 0; x--) {
			let other = this.grid.findMatchableAtPosition(x, matchable.y);
			if (!other || !this.matches(matchable, other))
				break;
			action(other);
		}
	}
	scanRight(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let x = matchable.x + 1; x < this.grid.width; x++) {
			let other = this.grid.findMatchableAtPosition(x, matchable.y);
			if (!other || !this.matches(matchable, other))
				break;
			action(other);
		}
	}
	scanDown(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let y = matchable.y - MagicNumbers.matchableYScale; y >= 0; y -= MagicNumbers.matchableYScale) {
			let other = this.grid.findMatchableAtPosition(matchable.x, y);
			if (!other || !this.matches(matchable, other))
				break;
			action(other);
		}
	}
	scanUp(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let y = matchable.y + MagicNumbers.matchableYScale; y < this.grid.height * MagicNumbers.matchableYScale; y += MagicNumbers.matchableYScale) {
			let other = this.grid.findMatchableAtPosition(matchable.x, y);
			if (!other || !this.matches(matchable, other))
				break;
			action(other);
		}
	}
}

export = MatchChecker;