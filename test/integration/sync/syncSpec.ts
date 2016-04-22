///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import FakeServerComms = require('../../util/fakeServerComms');
import LevelAndSimulationProvider = require('../../../app/Server/levelAndSimulationProvider');
import LevelDef = require('../../../app/Simulation/Levels/levelDef');
import Server = require('../../../app/Server/server');
import Simulation = require('../../../app/Simulation/simulation');
import TestLASProvider = require('../../util/testLASProvider');
import TestUtil = require('../../util/util');

describe('Sync', () => {
    it('correctly syncs the current scores, ownership, quiet state of columns for combos', () => {
		let serverComms = new FakeServerComms(1 / 60);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11222"
		]);
		let server = new Server(serverComms, new TestLASProvider(TestUtil.createNeverEndingLevel(5, 2), simulation), { fps: 60, framesPerTick: 2, initialLevel: 1 });
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 74; i++) {
			serverComms.addClient();
			serverComms.update();

			//Should be able to validate all simulations are the same every second tick
			serverComms.getAllSimulations().forEach(sim => {
				TestUtil.expectQuietDetectorIsSane(sim);
			})
		}
		serverComms.update();
		serverComms.update();
		serverComms.update();
		serverComms.update();
		serverComms.flushClients();

		let points =
			1 * simulation.scoreTracker.pointsPerMatchable * 3 +
			2 * simulation.scoreTracker.pointsPerMatchable * 4;

		let simulations = serverComms.getAllSimulations();
		expect(simulations.length).toBe(76); //server + 1 + 74

		for (let i = 0; i < simulations.length; i++) {
			let sim = simulations[i];
			expect(sim.scoreTracker.points[1]).toBe(points);

			expect(sim.framesElapsed).toBe(80);
			TestUtil.expectGridSize(sim.grid, [1, 0, 1, 1, 1]);
			TestUtil.expectGridQuiet(sim);
			TestUtil.expectQuietDetectorIsSane(sim);
		}
	});
});