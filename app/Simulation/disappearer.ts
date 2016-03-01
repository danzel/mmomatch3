import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable')

class Disappearer {
	private grid: Grid;

	matchableDisappeared = new LiteEvent<Matchable>();
	matchableTransformed = new LiteEvent<Matchable>();

	constructor(grid: Grid) {
		this.grid = grid;
	}

	update(dt: number) {
		let count = 0;
		for (let x = 0; x < this.grid.width; x++) {
			let col = this.grid.cells[x];
			for (let y = col.length - 1; y >= 0; y--) {
				let matchable = col[y];
				
				if (matchable.isDisappearing) {
					count++;
					matchable.disappearingTime += dt;
					
					if (matchable.disappearingPercent >= 1) {
						if (matchable.transformTo) {
							matchable.isDisappearing = false;
							matchable.disappearingTime = 0;
							
							matchable.type = matchable.transformTo;
							matchable.transformTo = null;
							matchable.color = matchable.transformToColor;
							matchable.transformToColor = null;
							
							this.matchableTransformed.trigger(matchable);
						} else {
							col.splice(y, 1);
							this.matchableDisappeared.trigger(matchable);
						}
					}
				}
			}
		}
	}
}

export = Disappearer;