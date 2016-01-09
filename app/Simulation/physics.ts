import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');

class Physics {
	private grid: Grid;

	matchableLanded = new LiteEvent<Matchable>();

	constructor(grid: Grid) {
		this.grid = grid;
	}

	update(dt: number) {
		let landed = [];

		for (let x = 0; x < this.grid.width; x++) {
			var col = this.grid.cells[x];
			for (let y = 0; y < col.length; y++) {
				let matchable = col[y];
				if (matchable.y > y && !matchable.beingSwapped && !matchable.isDisappearing) {
					matchable.yMomentum += dt * 100;

					matchable.y = Math.max(y, matchable.y - dt * matchable.yMomentum);
					
					//Stop when we hit the one below us and follow its speed
					if (y > 0) {
						let above = col[y - 1];
						if (matchable.y < above.y + 1) {
							matchable.y = above.y + 1;
							matchable.yMomentum = above.yMomentum;
						}
					}

					if (matchable.y == y) {
						matchable.yMomentum = 0;
						landed.push(matchable);
					}
				}
			}
		}

		for (let i = 0; i < landed.length; i++) {
			this.matchableLanded.trigger(landed[i]);
		}
	}
}

export = Physics;