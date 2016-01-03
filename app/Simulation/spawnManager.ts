import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');
import MatchableFactory = require('../Simulation/matchableFactory');

abstract class SpawnManager {
	protected grid: Grid;
	protected matchableFactory: MatchableFactory;

	matchableSpawned = new LiteEvent<Matchable>();

	constructor(grid: Grid, matchableFactory: MatchableFactory) {
		this.grid = grid;
		this.matchableFactory = matchableFactory;
	}

	abstract update(dt: number);

	protected findYForColumn(column: Array<Matchable>): number {
		let y = this.grid.height;

		if (column.length > 0) {
			let last = column[column.length - 1];
			if (last.y >= y) {
				y = last.y + 1;
			}
		}
		
		return y;
	}
}

export = SpawnManager;