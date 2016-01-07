import Color = require('./color');
import Grid = require('./grid');
import RandomGenerator = require('./randomGenerator');
import SpawnManager = require('./spawnManager');
import Matchable = require('./matchable');
import MatchableFactory = require('../Simulation/matchableFactory');

class SpawningSpawnManager extends SpawnManager {
	private isInitialSpawn = true;

	constructor(grid: Grid, matchableFactory: MatchableFactory, private randomGenerator: RandomGenerator) {
		super(grid, matchableFactory);	
	}
	
	update(dt: number) {
		for (let x = 0; x < this.grid.width; x++) {
			let column = this.grid.cells[x];

			while (column.length < this.grid.height) {
				let y = this.findYForColumn(column);

				let matchable = this.matchableFactory.create(x, y, this.getRandomColor(x, column.length));

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

			let color = this.randomGenerator.intExclusive(0, (Color.Max - bannedColors.length));

			for (var i = 0; i < bannedColors.length; i++) {
				if (bannedColors[i] <= color)
					color++;
			}

			return color;
		}

		return this.randomGenerator.intExclusive(0, Color.Max);
	}
}

export = SpawningSpawnManager;