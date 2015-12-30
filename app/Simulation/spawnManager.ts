import Color = require('./color');
import Grid = require('./grid')
import Matchable = require('./matchable')
import LiteEvent = require('../liteEvent')

class SpawnManager {
	matchableSpawned = new LiteEvent<Matchable>();

	private isInitialSpawn = true;

	constructor(private grid: Grid) {
	}

	update(dt: number) {
		for (let x = 0; x < this.grid.width; x++) {
			let column = this.grid.cells[x];

			while (column.length < this.grid.height) {
				let y = this.grid.height;

				if (column.length > 0) {
					let last = column[column.length - 1];
					if (last.y >= y) {
						y = last.y + 1;
					}
				}

				let matchable = new Matchable(x, y, this.getRandomColor(x, column.length));

				column.push(matchable);
				this.matchableSpawned.trigger(matchable);
			}
		}

		this.isInitialSpawn = false;
	}

	private getRandomColor(x, y): Color {
		if (this.isInitialSpawn) {
			let bannedColors = new Array<Color>();

			if (x > 1 && this.grid.cells[x - 1][y].color == this.grid.cells[x - 2][y].color) {
				bannedColors.push(this.grid.cells[x - 1][y].color);
			}
			if (y > 1 && this.grid.cells[x][y - 1].color == this.grid.cells[x][y - 2].color) {
				bannedColors.push(this.grid.cells[x][y - 1].color);
			}

			bannedColors.sort();

			let color = Math.floor(Math.random() * (Color.Max - bannedColors.length));

			for (var i = 0; i < bannedColors.length; i++) {
				if (bannedColors[i] <= color)
					color++;
			}

			return color;
		}

		return Math.floor(Math.random() * Color.Max);
	}
}

export = SpawnManager;