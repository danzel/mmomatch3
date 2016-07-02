///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import Color = require('../../app/Simulation/color');
import FailureType = require('../../app/Simulation/Levels/failureType');
import Grid = require('../../app/Simulation/grid');
import LevelDef = require('../../app/Simulation/Levels/levelDef');
import MagicNumbers = require('../../app/Simulation/magicNumbers');
import Matchable = require('../../app/Simulation/matchable');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('./neverSpawnManager');
import Simulation = require('../../app/Simulation/simulation');
import Type = require('../../app/Simulation/type');
import VictoryType = require('../../app/Simulation/Levels/victoryType');

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
				} else if (c == ' ') {
					continue;
				} else {
					let color: Color;
					let type = Type.Normal;
					if (c == '-') {
						type = Type.HorizontalClearWhenMatched;
					} else if (c == '|') {
						type = Type.VerticalClearWhenMatched;
					} else if (c == 'C') {
						type = Type.ColorClearWhenSwapped;
					} else if (c == 'B') {
						type = Type.GetToBottom
					} else if (c == '$') {
						type = Type.GetToBottomRace1;
					} else if (c == '%') {
						type = Type.GetToBottomRace2;
					} else if (c == 'G') {
						type = Type.GrowOverGrid;
					}

					if (type == Type.Normal) {
						if (c == '*') {
							color = Color.None;
						} else {
							color = parseInt(c, 10);
						}
					} else if (type == Type.GetToBottom || type == Type.GetToBottomRace1 || type == Type.GetToBottomRace2 || type == Type.GrowOverGrid) {
						color = Color.None;
					} else {
						color = parseInt(specialColors[0], 10);
						specialColors = specialColors.substring(1);
					}

					grid.cells[x].push(new Matchable(idCounter, x, y * MagicNumbers.matchableYScale, color, type));
					idCounter++;
				}
			}
		}
	}
	
	/** Populate a grid with the given contents.
	 * Use 0-9 for the matchable 'color'.
	 * X for holes
	 * * for unclearable
	 * - for horizontal clear
	 * | for vertical clear
	 * C for color clear
	 * B for get to bottom
	 * (Unimplemented follow)
	 * + for horizontal and vertical clear
	 * # for 3x3 clear
	 * @param specialColors The colors of the special matchables in bottom to top, left to right order
	 */
	static prepareForTest(gridConfig: Array<string>, specialColors?: string, tickRate: number = 1): Simulation {
		var grid = new Grid(gridConfig[0].length, gridConfig.length);
		TestUtil.populateGrid(grid, gridConfig, specialColors);
		var matchableFactory = new MatchableFactory();
		var simulation = new Simulation(grid, new NeverSpawnManager(grid, matchableFactory), matchableFactory, tickRate);

		simulation.matchPerformer.swapDidntCauseAMatch.on((swap) => {
			expect("Swapped " + swap.left.x + "," + swap.left.y + " " + swap.right.x + "," + swap.right.y + " and there was no match!").toBe("");
		});
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
	
	static expectQuietDetectorIsSane(simulation: Simulation) {
		let badSwaps = simulation.quietColumnDetector.columnSwapsInProgressCount.map((count, index) => count >= 0 ? -1 : index).filter(x => x != -1);
		let badDisappearCount = simulation.quietColumnDetector.columnDisappearingCount.map((count, index) => count >= 0 ? -1 : index).filter(x => x != -1);
		
		if (badSwaps.length != 0) {
			expect('columns with negative swaps: ' + badSwaps).toBe('empty');
		}
		if (badDisappearCount.length != 0) {
			expect('columns with negative disappear count: ' + badDisappearCount).toBe('empty');
		}
	}

	static expectGridSize(grid: Grid, columnSizes: Array<number>) {
		if (grid.width != columnSizes.length) {
			throw new Error("TEST BUG: columnSizes doesn't match the grid width")
		}
		let actualSizes = new Array<number>();
		for (let i = 0; i < grid.width; i++) {
			actualSizes.push(grid.cells[i].length);
		}
		expect(actualSizes).toEqual(columnSizes);
	}
	
	static createNeverEndingLevel(width: number, height: number, victoryType?: VictoryType): LevelDef {
		return new LevelDef(1, width, height, [], 8, FailureType.Time, victoryType || VictoryType.Matches, 9999999, 9999999);
	}
}

export = TestUtil;