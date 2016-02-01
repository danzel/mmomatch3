import Grid = require('./grid');
import Matchable = require('./matchable');

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
	
	grid: Grid;

	constructor(grid: Grid) {
		this.grid = grid;
	}

	testForMatch(matchable: Matchable): MatchDetails {
		
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
		
		return null;
	}

	private matches(a: Matchable, b: Matchable): boolean {
		if (!a || !b)
			return false;

		if (a.color != b.color)
			return false;

		if (a.isDisappearing || b.isDisappearing)
			return false;
		if (a.isMoving || b.isMoving)
			return false;
		if (a.beingSwapped || b.beingSwapped)
			return false;

		return true;
	}
	
	scanLeft(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let x = matchable.x - 1; x >= 0; x--) {
			if (!this.matches(matchable, this.grid.cells[x][matchable.y]))
				break;
			action(this.grid.cells[x][matchable.y]);
		}
	}
	scanRight(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let x = matchable.x + 1; x < this.grid.width; x++) {
			if (!this.matches(matchable, this.grid.cells[x][matchable.y]))
				break;
			action(this.grid.cells[x][matchable.y]);
		}
	}
	scanDown(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let y = matchable.y - 1; y >= 0; y--) {
			if (!this.matches(matchable, this.grid.cells[matchable.x][y]))
				break;
			action(this.grid.cells[matchable.x][y]);
		}
	}
	scanUp(matchable: Matchable, action: (matchable: Matchable) => void) {
		for (let y = matchable.y + 1; y < this.grid.height; y++) {
			if (!this.matches(matchable, this.grid.cells[matchable.x][y]))
				break;
			action(this.grid.cells[matchable.x][y]);
		}
	}
}

export = MatchChecker;