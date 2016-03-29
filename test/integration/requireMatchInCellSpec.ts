///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import FakeServerComms = require('../util/fakeServerComms');
import RequireMatch = require('../../app/simulation/requireMatch');
import Server = require('../../app/Server/server');
import TestLASProvider = require('../util/testLASProvider');
import TestUtil = require('../util/util');

describe('RequireMatchInCell', () => {
	it('removes when matched and syncs correctly to clients', () => {
		let serverComms = new FakeServerComms(1 / 60);
		let simulation = TestUtil.prepareForTest(
			['1121']
		);

		let server = new Server(serverComms, new TestLASProvider(TestUtil.createNeverEndingLevel(5, 2), simulation), 2);
		server.loadLevel(1);
		simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(0, 0, 1));
		simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(1, 0, 1));
		simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(2, 0, 1));
		simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(3, 0, 1));
		serverComms.server = server;

		let requirementsMet = 0;
		simulation.requireMatchInCellTracker.requirementMet.on((req) => requirementsMet++)

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		serverComms.getAllSimulations().forEach(sim => {
			expect(sim.requireMatchInCellTracker.requirements.length).toBe(4);
		})

		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[3][0].id);
		for (let i = 0; i < 60; i++) {
			serverComms.update();
		}
		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		serverComms.getAllSimulations().forEach(sim => {
			expect(sim.requireMatchInCellTracker.requirements.length).toBe(1);
		})

		expect(requirementsMet).toBe(3);
	});
});