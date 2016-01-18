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
	
	columnBecameQuiet = new LiteEvent<number>();
	
	constructor(private grid: Grid, physics: Physics, swapHandler: SwapHandler, matchPerformer: MatchPerformer, disappearer: Disappearer) {
		
		for (let i = 0; i < grid.width; i++) {
			this.columnSwapsInProgressCount.push(0);
			this.columnDisappearingCount.push(0);
		}
		
		physics.matchableLanded.on(this.matchableLanded.bind(this));

		swapHandler.swapStarted.on(this.onSwapStarted.bind(this));
		swapHandler.swapOccurred.on(this.onSwapOccurred.bind(this));
		
		matchPerformer.matchPerformed.on(this.onMatchPerformed.bind(this));
		disappearer.matchableDisappeared.on(this.onMatchableDisappeared.bind(this))
	}
	
	matchableLanded(matchable: Matchable) {
		//If we land and we are in our correct place and there is nothing above us
		let col = this.grid.cells[matchable.x];
		if (matchable.y == col.indexOf(matchable) && matchable.y == col.length - 1) {
			this.columnsNeedingCheck.push(matchable.x);
		}
	}


	onSwapStarted(swap: Swap) {
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
			this.columnDisappearingCount[matchables[i].x]++;
		}
	}
	
	onMatchableDisappeared(matchable: Matchable) {
		this.columnDisappearingCount[matchable.x]--;

		//TODO: Only if this is the last matchable in the column
		this.columnsNeedingCheck.push(matchable.x);		
	}
	
	lateUpdate(dt: number) {
		//TODO: Check for distinct x values
		for (let i = 0; i < this.columnsNeedingCheck.length; i++) {
			var x = this.columnsNeedingCheck[i];
			var col = this.grid.cells[x];
			
			if (this.columnDisappearingCount[x] == 0 && this.columnSwapsInProgressCount[x] == 0) {
				if (col.length == 0 || (!col[col.length - 1].isMoving && col[col.length - 1].y == col.length - 1)) {
					this.columnBecameQuiet.trigger(x);
				}
			}
		}
		this.columnsNeedingCheck.length = 0;
	}
}

export = QuietColumnDetector;