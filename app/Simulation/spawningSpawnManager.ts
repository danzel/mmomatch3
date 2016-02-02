import Color = require('./color');
import Grid = require('./grid');
import RandomGenerator = require('./randomGenerator');
import SpawnManager = require('./spawnManager');
import Matchable = require('./matchable');
import MatchableFactory = require('../Simulation/matchableFactory');

class SpawningSpawnManager extends SpawnManager {
	private isInitialSpawn = true;

	constructor(grid: Grid, matchableFactory: MatchableFactory, private randomGenerator: RandomGenerator, private maxColor: number) {
		super(grid, matchableFactory);	
	}
	
	update(dt: number) {
		for (let x = 0; x < this.grid.width; x++) {
			let column = this.grid.cells[x];
			let max = this.grid.maxMatchablesInColumn(x);
			while (column.length < max) {
				let y = this.findYForColumn(column);

				let matchable = this.matchableFactory.create(x, y, this.getRandomColor(x, column.length));

				column.push(matchable);
				this.matchableSpawned.trigger(matchable);
			}
		}

		this.isInitialSpawn = false;
	}

	private getRandomColor(x: number, y: number): Color {
		if (this.isInitialSpawn) {
			let bannedColors = new Array<Color>();

			//TODO Index lookups are no good
			console.log(x, y);
			if (x > 1) {
				let left1 = this.grid.findMatchableAtPosition(x - 1, y);
				let left2 = this.grid.findMatchableAtPosition(x - 2, y);
				
				if (left1 != null && left2 != null && left1.color == left2.color) {
					bannedColors.push(this.grid.cells[x - 1][y].color);
				}
			}
			if (y > 1 && this.grid.cells[x][y - 1].color == this.grid.cells[x][y - 2].color) {
				bannedColors.push(this.grid.cells[x][y - 1].color);
			}

			bannedColors.sort();

			let color = this.randomGenerator.intExclusive(0, (this.maxColor - bannedColors.length));

			for (var i = 0; i < bannedColors.length; i++) {
				if (bannedColors[i] <= color)
					color++;
			}

			return color;
		}

		return this.randomGenerator.intExclusive(0, this.maxColor);
	}
}

export = SpawningSpawnManager;