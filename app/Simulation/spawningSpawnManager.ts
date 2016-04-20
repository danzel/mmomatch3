import Color = require('./color');
import Grid = require('./grid');
import Matchable = require('./matchable');
import MatchableFactory = require('../Simulation/matchableFactory');
import RandomGenerator = require('./randomGenerator');
import SpawnManager = require('./spawnManager');
import SpawnOverride = require('./spawnOverride');
import Type = require('./type');

class SpawningSpawnManager extends SpawnManager {
	spawnOverride: SpawnOverride;

	private isInitialSpawn = true;

	constructor(grid: Grid, matchableFactory: MatchableFactory, private randomGenerator: RandomGenerator, private maxColor: number) {
		super(grid, matchableFactory);
	}

	update(dt: number) {
		if (this.isInitialSpawn) {
			this.doInitialSpawn();
			this.isInitialSpawn = false;
		} else {
			this.doNormalSpawn();
		}
	}

	private doNormalSpawn(): void {
		for (let x = 0; x < this.grid.width; x++) {
			let column = this.grid.cells[x];
			let max = this.grid.maxMatchablesInColumn(x);
			let holeSum = 0;
			while (column.length < max) {
				let y = this.findYForColumn(column);

				let matchable = this.matchableFactory.create(x, y, this.randomGenerator.intExclusive(0, this.maxColor), Type.Normal);

				column.push(matchable);
				this.matchableSpawned.trigger(matchable);
			}
		}
	}

	private doInitialSpawn(): void {
		for (let x = 0; x < this.grid.width; x++) {
			let column = this.grid.cells[x];
			for (let y = 0; y < this.grid.height; y++) {

				if (this.grid.isHole(x, y)) {
					continue;
				}

				let matchable: Matchable = null;
				matchable = this.spawnOverride.spawnMaybe(x, y + this.grid.height);
				if (!matchable) {
					matchable = this.matchableFactory.create(x, y + this.grid.height, this.getRandomColorForInitialSpawn(x, y + this.grid.height), Type.Normal);
				}

				column.push(matchable);
				this.matchableSpawned.trigger(matchable);
			}
		}
	}

	private getRandomColorForInitialSpawn(x: number, y: number): Color {
		let bannedColors = new Array<Color>();

		if (x > 1) {
			let left1 = this.grid.findMatchableAtPosition(x - 1, y);
			let left2 = this.grid.findMatchableAtPosition(x - 2, y);

			if (left1 && left2 && left1.color == left2.color) {
				bannedColors.push(left1.color);
			}
		}
		if (y > 1) {
			var up1 = this.grid.findMatchableAtPosition(x, y - 1);
			var up2 = this.grid.findMatchableAtPosition(x, y - 2);

			if (up1 && up2 && up1.color == up2.color) {
				bannedColors.push(up1.color);
			}
		}

		bannedColors.sort();

		let color = this.randomGenerator.intExclusive(0, (this.maxColor - bannedColors.length));

		for (var i = 0; i < bannedColors.length; i++) {
			if (bannedColors[i] <= color)
				color++;
		}

		return color;
	}
}

export = SpawningSpawnManager;