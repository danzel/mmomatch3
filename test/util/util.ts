import Grid = require('../../app/Simulation/grid');
import Matchable = require('../../app/Simulation/matchable');

class TestUtil {
	static populateGrid(grid: Grid, contents: Array<string>) {
		let idCounter = 1;
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				var c = contents[grid.height - 1 - y][x];

				grid.cells[x].push(new Matchable(idCounter, x, y, parseInt(c, 10)));
				idCounter++;
			}
		}
	}
}

export = TestUtil;