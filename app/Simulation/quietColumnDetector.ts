import Disappearer = require('./disappearer');
import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');
import MatchPerformer = require('./matchPerformer');
import Physics = require('./physics');
import Swap = require('./swap');
import SwapHandler = require('./swapHandler');

class QuietColumnDetector {
	private columnsNeedingCheck: Array<number> = [];

	private columnSwapsInProgressCount: Array<number> = [];
	private columnDisappearingCount: Array<number> = [];

	columnIsQuiet = new Array<boolean>();
	columnBecameQuiet = new LiteEvent<number>();
	gridBecameQuiet = new LiteEvent<void>();

	constructor(private grid: Grid, physics: Physics, swapHandler: SwapHandler, matchPerformer: MatchPerformer, disappearer: Disappearer) {

		for (let i = 0; i < grid.width; i++) {
			this.columnSwapsInProgressCount.push(0);
			this.columnDisappearingCount.push(0);
			this.columnIsQuiet.push(true);
		}

		physics.matchableLanded.on(this.matchableLanded.bind(this));

		swapHandler.swapStarted.on(this.onSwapStarted.bind(this));
		swapHandler.swapOccurred.on(this.onSwapOccurred.bind(this));

		matchPerformer.matchPerformed.on(this.onMatchPerformed.bind(this));
		disappearer.matchableDisappeared.on(this.onMatchableDisappeared.bind(this))
	}

	matchableLanded(matchable: Matchable) {
		//If we land and there is nothing above us
		let col = this.grid.cells[matchable.x];
		if (matchable == col[col.length -1]) {
			this.columnsNeedingCheck.push(matchable.x);
		}
	}


	onSwapStarted(swap: Swap) {
		this.columnIsQuiet[swap.left.x] = false;
		this.columnIsQuiet[swap.right.x] = false;
		this.columnSwapsInProgressCount[swap.left.x]++;
		this.columnSwapsInProgressCount[swap.right.x]++;
	}

	onSwapOccurred(swap: Swap) {
		this.columnSwapsInProgressCount[swap.left.x]--;
		this.columnSwapsInProgressCount[swap.right.x]--;

		//This could be optimised by checking we are the last swap in the columns
		this.columnsNeedingCheck.push(swap.left.x);
		if (swap.left.x != swap.right.x) {
			this.columnsNeedingCheck.push(swap.right.x);
		}
	}


	onMatchPerformed(matchables: Matchable[]) {
		for (let i = 0; i < matchables.length; i++) {
			this.columnIsQuiet[matchables[i].x] = false;
			this.columnDisappearingCount[matchables[i].x]++;
		}
	}

	onMatchableDisappeared(matchable: Matchable) {
		this.columnDisappearingCount[matchable.x]--;

		//Optimisation: Only if this is the last matchable in the column (in which case it may mean none above it started to fall)
		this.columnsNeedingCheck.push(matchable.x);
	}

	lateUpdate(dt: number) {
		let oneBecameQuiet = false;
		
		for (let i = 0; i < this.columnsNeedingCheck.length; i++) {
			var x = this.columnsNeedingCheck[i];

			if (!this.columnIsQuiet[x] && this.isColumnQuiet(x)) {
				this.columnIsQuiet[x] = true;
				this.columnBecameQuiet.trigger(x);
				oneBecameQuiet = true;
			}
		}
		this.columnsNeedingCheck.length = 0;
		
		//Check if there are now no columns busy
		if (oneBecameQuiet) {
			let allQuiet = this.columnIsQuiet.every(x => x);

			if (allQuiet) {
				this.gridBecameQuiet.trigger();
			}
		}
	}

	private isColumnQuiet(x: number) {
		var col = this.grid.cells[x];

		if (this.columnDisappearingCount[x] == 0 && this.columnSwapsInProgressCount[x] == 0) {
			let colLengthExpected = this.grid.maxMatchablesInColumn(x);
			if (colLengthExpected == 0) {
				return true;
			}
			if (col.length == 0) {
				return true;
			}
			let lastMatchable = col[col.length - 1];
			
			if (!lastMatchable.isMoving) {
				return true;
			}
		}
		return false;
	}
}

export = QuietColumnDetector;