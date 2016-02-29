import Color = require('../../app/Simulation/color');
import Grid = require('../../app/Simulation/grid');
import Matchable = require('../../app/Simulation/matchable');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('./neverSpawnManager');
import Simulation = require('../../app/Simulation/simulation');
import Type = require('../../app/Simulation/type');

class TestUtil {
	/** Populate a grid with the given contents.
	 * @see prepareForTest
	 */
	static populateGrid(grid: Grid, contents: Array<string>, specialColors?: string) {
		let idCounter = 1;
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				var c = contents[grid.height - 1 - y][x];
				if (c == 'X') {
					grid.setHole(x, y);
				} else {
					let color: Color;
					let type = Type.Normal;
					if (c == '-') {
						type = Type.HorizontalClearWhenMatched;
					}

					if (type == Type.Normal) {
						color = parseInt(c, 10)
					} else {
						color = parseInt(specialColors[0], 10);
						specialColors = specialColors.substring(1);
					}

					grid.cells[x].push(new Matchable(idCounter, x, y, color, type));
					idCounter++;
				}
			}
		}
	}
	
	/** Populate a grid with the given contents.
	 * Use 0-9 for the matchable 'color'.
	 * X for holes
	 * * for unclearable
	 * (Unimplemented follow)
	 * C for color clear
	 * - for horizontal clear
	 * | for vertical clear
	 * + for horizontal and vertical clear
	 * # for 3x3 clear
	 * @param specialColors The coors of the special matchables in bottom to top, left to right order
	 */
	static prepareForTest(gridConfig: Array<string>, specialColors?: string): Simulation {
		var grid = new Grid(gridConfig[0].length, gridConfig.length);
		TestUtil.populateGrid(grid, gridConfig, specialColors);
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