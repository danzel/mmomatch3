import Grid = require('./grid');
import LiteEvent = require('../liteEvent')
import Matchable = require('./matchable');
import Swap = require('./swap');

class SwapHandler {
	public static TimeToSwap = 0.2;

	swapOccurred = new LiteEvent<Swap>();

	private grid: Grid;
	swaps: Array<Swap>;

	constructor(grid: Grid) {
		this.grid = grid;
		this.swaps = [];
	}

	swap(x: number, y: number, xTarget: number, yTarget: number) {
		let swap = new Swap(this.grid.cells[x][y], this.grid.cells[xTarget][yTarget]);
		swap.left.beingSwapped = true;
		swap.right.beingSwapped = true;

		this.swaps.push(swap);
		
		//TODO: Event?
	}

	update(dt: number) {
		for (let i = this.swaps.length - 1; i >= 0; i--) {
			var swap = this.swaps[i];

			swap.time += dt;
			swap.percent = swap.time / SwapHandler.TimeToSwap
			if (swap.percent >= 1) {
				let left = swap.left;
				let right = swap.right;

				let tempX = left.x;
				let tempY = left.y;

				left.x = right.x;
				left.y = right.y;
				left.beingSwapped = false;

				right.x = tempX;
				right.y = tempY;
				right.beingSwapped = false;
			
				//Update them in the grid
				this.grid.cells[left.x][left.y] = left;
				this.grid.cells[right.x][right.y] = right;

				this.swaps.splice(i, 1);

				this.swapOccurred.trigger(swap);
			}
		}
	}
}

export = SwapHandler;