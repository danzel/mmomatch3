import Grid = require('./grid');
import Matchable = require('./matchable');
import Physics = require('./physics');
import Swap = require('./swap');
import SwapHandler = require('./swapHandler');

class MatchChecker {
	public static MinimumSizeToMatch = 3;
	
	grid: Grid;

	constructor(grid: Grid, swapHandler: SwapHandler, physics: Physics) {
		this.grid = grid;

		swapHandler.swapOccurred.on(this.onSwapOccurred.bind(this));
		physics.matchableLanded.on(this.testForMatch.bind(this));
	}

	onSwapOccurred(swap: Swap) {
		this.testForMatch(swap.left);

		if (!swap.right.isDisappearing)
			this.testForMatch(swap.right);
	}

	private testForMatch(matchable: Matchable) {
		console.log('checking', matchable.x, matchable.y);
		
		//Horizontal Test
		let xSame = 1;
		this.scanLeft(matchable, () => xSame++);
		this.scanRight(matchable, () => xSame++);
		
		//Vertical Test
		let ySame = 1;
		this.scanDown(matchable, () => ySame++);
		this.scanUp(matchable, () => ySame++);
		
		if (xSame >= MatchChecker.MinimumSizeToMatch || ySame >= MatchChecker.MinimumSizeToMatch) {
			this.performMatch(matchable, xSame >= MatchChecker.MinimumSizeToMatch, ySame >= MatchChecker.MinimumSizeToMatch);
		}
	}
	
	private performMatch(matchable: Matchable, horizontal: boolean, vertical: boolean) {

		if (horizontal) {
			this.scanLeft(matchable, (hit: Matchable) => hit.isDisappearing = true);
			this.scanRight(matchable, (hit: Matchable) => hit.isDisappearing = true);
		}
		if (vertical) {
			this.scanUp(matchable, (hit: Matchable) => hit.isDisappearing = true);
			this.scanDown(matchable, (hit: Matchable) => hit.isDisappearing = true);
		}

		matchable.isDisappearing = true;
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
	
	private scanLeft(matchable: Matchable, action: (Matchable) => void) {
		for (let x = matchable.x - 1; x >= 0; x--) {
			if (!this.matches(matchable, this.grid.cells[x][matchable.y]))
				break;
			action(this.grid.cells[x][matchable.y]);
		}
	}
	private scanRight(matchable: Matchable, action: (Matchable) => void) {
		for (let x = matchable.x + 1; x < this.grid.width; x++) {
			if (!this.matches(matchable, this.grid.cells[x][matchable.y]))
				break;
			action(this.grid.cells[x][matchable.y]);
		}
	}
	private scanDown(matchable: Matchable, action: (Matchable) => void) {
		for (let y = matchable.y - 1; y >= 0; y--) {
			if (!this.matches(matchable, this.grid.cells[matchable.x][y]))
				break;
			action(this.grid.cells[matchable.x][y]);
		}
	}
	private scanUp(matchable: Matchable, action: (Matchable) => void) {
		for (let y = matchable.y + 1; y < this.grid.height; y++) {
			if (!this.matches(matchable, this.grid.cells[matchable.x][y]))
				break;
			action(this.grid.cells[matchable.x][y]);
		}
	}
}

export = MatchChecker;