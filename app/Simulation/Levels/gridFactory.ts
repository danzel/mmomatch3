import Grid = require('../grid');
import LevelDef = require('./levelDef');

class GridFactory {
	static createGrid(level: LevelDef): Grid {
		let grid = new Grid(level.width, level.height);

		for (let i = 0; i < level.holes.length; i++) {
			let hole = level.holes[i];
			grid.setHole(hole.x, hole.y);
		}

		return grid;
	}
}

export = GridFactory;