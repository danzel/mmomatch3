///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import FakeServerComms = require('../util/fakeServerComms');
import LevelAndSimulationProvider = require('../../app/Server/levelAndSimulationProvider');
import LevelDef = require('../../app/Simulation/Levels/levelDef');
import PointsScoreTracker = require('../../app/Simulation/Scoring/ScoreTrackers/pointsScoreTracker');
import Server = require('../../app/Server/server');
import Simulation = require('../../app/Simulation/simulation');
import TestLASProvider = require('../util/testLASProvider');
import TestUtil = require('../util/util');
import VictoryType = require('../../app/Simulation/Levels/victoryType');

describe('EmoteTransmission', () => {
	it('correctly sends an emote between players, but not back to the sender', () => {
		let serverComms = new FakeServerComms(1 / 60);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11222"
		]);
		let server = new Server(serverComms, new TestLASProvider(TestUtil.createNeverEndingLevel(5, 2, VictoryType.Score), simulation), { fps: 60, framesPerTick: 2, initialLevel: 1, version: null });
		server.start();
		serverComms.server = server;

		let emotesReceived = 0;

		let client1 = serverComms.addClient();
		client1.emoteReceived.on(() => { throw new Error('client1 shouldnt receive an emote back'); });
		let client2 = serverComms.addClient();
		client2.emoteReceived.on(e => {
			expect(e.emoteNumber).toBe(1);
			expect(e.playerId).toBe(1);
			expect(e.x).toBe(2);
			expect(e.y).toBe(3);
			emotesReceived++;
		});
		serverComms.update();
		serverComms.update();

		client1.sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 80; i++) {
			serverComms.update();
		}
		client1.sendEmote(1, 2, 3);

		serverComms.update();
		serverComms.update();
		serverComms.update();
		serverComms.update();
		serverComms.flushClients();

		expect(emotesReceived).toBe(1);
	});
});