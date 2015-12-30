import Grid = require('./grid');
import SwapHandler = require('./swapHandler');

class InputVerifier {
	private grid: Grid;
	private swapHandler: SwapHandler;
	
	constructor(grid: Grid, swapHandler: SwapHandler) {
		this.grid = grid;
		this.swapHandler = swapHandler;
	}
	
	swapIsValid(x: number, y: number, xTarget: number, yTarget: number) : boolean {
		if (!this.posIsValid(x, y))
			return false;
		if (!this.posIsValid(xTarget, yTarget))
			return false;
		
		if (x == xTarget) { //y swap
			if (yTarget == y + 1 || yTarget == y - 1)
				return true;
		}
		else if (y == yTarget) { //x swap
			if (xTarget == x + 1 || xTarget == x - 1)
				return true;
		}
		
		//TODO: Check if a swap actually causes a match?
		
		return false;
	}
	
	private posIsValid(x: number, y: number) : boolean {
		if (!this.isInt(x) || !this.isInt(y))
			return false;
		
		//Check we are on the grid
		if (x < 0 || y < 0 || x >= this.grid.width || y >= this.grid.height)
			return false;
		
		//And that this pos exists and isn't moving
		let col = this.grid.cells[x];
		if (col.length < y)
			return false;
		if (col[y].isMoving)
			return false;
			
		//And that it and any of those below it aren't in a swap
		let swaps = this.swapHandler.swaps;
		for (let i = 0; i < swaps.length; i++) {
			var swap = swaps[i];
			if (swap.left.x == x && swap.left.y <= y)
				return false;

			if (swap.right.x == x && swap.right.y <= y)
				return false;
		}
		
		return true;
	}
	
	private isInt(n: number) : boolean {
		return n === +n && n === (n|0)
	}
}

export = InputVerifier;