///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Matchable = require('../../../app/Simulation/matchable');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');


describe('QuietColumnsDetector', () => {
	it('detects quiet columns', () => {
		let simulation = TestUtil.prepareForTest([
			"17",
			"18",
			"91"
		]);

		let quietColumns = new Array<number>();
		let columnQuietCount = 0;
		let gridQuietCount = 0;

		simulation.quietColumnDetector.columnBecameQuiet.on((x) => { columnQuietCount++; quietColumns.push(x) });
		simulation.quietColumnDetector.gridBecameQuiet.on(() => gridQuietCount++);

		simulation.swapHandler.swap(99, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);

		for (let i = 0; i < SwapHandler.TicksToSwap; i++) {
			simulation.update();
		}

		//At this stage the swap should be done and the match started
		expect(quietColumns).toContain(1);
		expect(quietColumns).not.toContain(0);

		for (let i = 0; i < Matchable.TicksToDisappear; i++) {
			simulation.update();
		}

		expect(columnQuietCount).toBe(2);
		expect(quietColumns).toContain(0);
		expect(quietColumns).toContain(1);

		expect(gridQuietCount).toBe(1);
		TestUtil.expectGridQuiet(simulation);
	});

	it('detects quiet columns when there are holes', () => {
		let simulation = TestUtil.prepareForTest([
			"85",
			"X5",
			"16",
			"17",
			"81",
			"X9"
		]);

		let quietColumns = new Array<number>();
		let columnQuietCount = 0;
		let gridQuietCount = 0;

		simulation.quietColumnDetector.columnBecameQuiet.on((x) => { columnQuietCount++; quietColumns.push(x) });
		simulation.quietColumnDetector.gridBecameQuiet.on(() => gridQuietCount++);

		simulation.swapHandler.swap(99, simulation.grid.cells[0][0], simulation.grid.cells[1][1]);

		for (let i = 0; i < SwapHandler.TicksToSwap; i++) {
			simulation.update();
		}

		//At this stage the swap should be done and the match started
		expect(quietColumns).toContain(1);
		expect(quietColumns).not.toContain(0);
		expect(gridQuietCount).toBe(0);

		for (let i = 0; i < Matchable.TicksToDisappear + 1; i++) {
			simulation.update();
		}

		expect(columnQuietCount).toBe(2);
		expect(quietColumns).toContain(0);
		expect(quietColumns).toContain(1);

		expect(gridQuietCount).toBe(1);
		TestUtil.expectGridQuiet(simulation);
	});
});