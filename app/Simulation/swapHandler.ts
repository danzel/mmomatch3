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
		this.checkPreSwap(swap);
		
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
				let leftCol = this.grid.cells[left.x];
				let rightCol = this.grid.cells[right.x];

				let leftY = leftCol.indexOf(left);
				let rightY = rightCol.indexOf(right);

				this.checkSwap(swap);
					
				let tempX = left.x;
				let tempY = left.y;

				left.x = right.x;
				left.y = right.y;
				left.beingSwapped = false;

				right.x = tempX;
				right.y = tempY;
				right.beingSwapped = false;
				
				//Update them in the grid
				rightCol[rightY] = left;
				leftCol[leftY] = right;

				this.swaps.splice(i, 1);

				this.swapOccurred.trigger(swap);
			}
		}
	}
	
	private checkPreSwap(swap: Swap) {
		if (swap.left.beingSwapped)
			throw "Left is already being swapped";
		if (swap.right.beingSwapped)
			throw "Right is already being swapped";

		if (swap.left == swap.right)
			throw "swapping left == right";

		//Check we are at a good index
		if (swap.left.y != (swap.left.y|0))
			throw "Left isn't at an integer y";
		if (swap.right.y != (swap.right.y|0))
			throw "Right isn't at an integer y";
	}
	
	private checkSwap(swap: Swap) {
		//Check we are at a good index
		if (swap.left.y != (swap.left.y|0))
			throw "Left isn't at an integer y";
		if (swap.right.y != (swap.right.y|0))
			throw "Right isn't at an integer y";
	}
}

export = SwapHandler;