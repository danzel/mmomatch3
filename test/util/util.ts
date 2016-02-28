import Grid = require('../../app/Simulation/grid');
import Matchable = require('../../app/Simulation/matchable');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('./neverSpawnManager');
import Simulation = require('../../app/Simulation/simulation');

class TestUtil {
	static populateGrid(grid: Grid, contents: Array<string>) {
		let idCounter = 1;
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				var c = contents[grid.height - 1 - y][x];
				if (c == 'X') {
					grid.setHole(x, y);
				} else {
					grid.cells[x].push(new Matchable(idCounter, x, y, parseInt(c, 10)));
					idCounter++;
				}
			}
		}
	}
	
	static prepareForTest(gridConfig: Array<string>): Simulation {
		var grid = new Grid(gridConfig[0].length, gridConfig.length);
		TestUtil.populateGrid(grid, gridConfig);
		var matchableFactory = new MatchableFactory();
		var simulation = new Simulation(grid, new NeverSpawnManager(grid, matchableFactory), matchableFactory);

		return simulation;
	}
	
	static gameNeverOver() {
		return { gameHasEnded: false }; 
	}
	
	static expectGridQuiet(simulation: Simulation) {
		let busyColumns = simulation.quietColumnDetector.columnIsQuiet.map((quiet, index) => quiet ? -1 : index).filter(x => x != -1);
		
		if (busyColumns.length != 0) {
			expect(busyColumns).toBe([]);
		}
	}

}

export = TestUtil;