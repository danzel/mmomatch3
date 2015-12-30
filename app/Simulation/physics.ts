import Grid = require('./grid');

class Physics {
	grid: Grid;

	constructor(grid: Grid) {
		this.grid = grid;
	}

	update(dt: number) {
		for (let x = 0; x < this.grid.width; x++) {
			var col = this.grid.cells[x];
			for (let y = 0; y < col.length; y++) {
				var matchable = col[y];
				if (matchable.y > y) {
					matchable.yMomentum += dt * 100;
					matchable.y = Math.max(y, matchable.y - dt * matchable.yMomentum);
				} else {
					matchable.yMomentum = 0;
				}
			}
		}
	}
}

export = Physics;