import Grid = require('./grid');
import LiteEvent = require('../liteEvent')
import Matchable = require('./matchable');
import Swap = require('./swap');

class SwapHandler {
	public static TimeToSwap = 0.2;

	swapStarted = new LiteEvent<Swap>();
	swapOccurred = new LiteEvent<Swap>();

	private grid: Grid;
	swaps: Array<Swap>;

	constructor(grid: Grid) {
		this.grid = grid;
		this.swaps = [];
	}

	swap(left: Matchable, right: Matchable) {
		let swap = new Swap(left, right);
		this.checkPreSwap(swap);
		
		swap.left.beingSwapped = true;
		swap.right.beingSwapped = true;

		this.swaps.push(swap);
		this.swapStarted.trigger(swap);
	}

	update(dt: number) {
		for (let i = this.swaps.length - 1; i >= 0; i--) {
			var swap = this.swaps[i];

			swap.time += dt;
			swap.percent = swap.time / SwapHandler.TimeToSwap
			if (swap.percent >= 1) {
				let left = swap.left;
				let right = swap.right;

				this.checkSwap(swap);
				this.grid.swap(left, right);

				left.beingSwapped = false;
				right.beingSwapped = false;

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