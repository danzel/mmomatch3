///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import FailureType = require('../../../app/Simulation/Levels/failureType');
import FakeServerComms = require('../../util/fakeServerComms');
import LevelDef = require('../../../app/Simulation/Levels/levelDef');
import Server = require('../../../app/Server/server');
import Simulation = require('../../../app/Simulation/simulation');
import TestLASProvider = require('../../util/testLASProvider');
import TestUtil = require('../../util/util');
import VictoryType = require('../../../app/Simulation/Levels/victoryType');

import MatchesDetector = require('../../../app/Simulation/Levels/Detectors/matchesDetector');
import ScoreDetector = require('../../../app/Simulation/Levels/Detectors/scoreDetector');
import SwapsDetector = require('../../../app/Simulation/Levels/Detectors/swapsDetector');
import TimeDetector = require('../../../app/Simulation/Levels/Detectors/timeDetector');

describe('SyncDetectors', () => {
	it('correctly syncs MatchesDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11222"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Matches, 999999, 7);
		let server = new Server(serverComms, new TestLASProvider(level, simulation));
		server.loadLevel(1);
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 5; i++) {
			serverComms.addClient();
			serverComms.update();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<MatchesDetector>g.victoryDetector).matchesRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
		}
	});
	it('correctly syncs ScoreDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11222"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Score, 999999, 70);
		let server = new Server(serverComms, new TestLASProvider(level, simulation));
		server.loadLevel(1);
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 5; i++) {
			serverComms.addClient();
			serverComms.update();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<ScoreDetector>g.victoryDetector).scoreRequiredRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
		}
	});
	it('correctly syncs SwapsDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11222"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Score, 1, 999999);
		let server = new Server(serverComms, new TestLASProvider(level, simulation));
		server.loadLevel(1);
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 5; i++) {
			serverComms.addClient();
			serverComms.update();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<SwapsDetector>g.failureDetector).swapsRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
		}
	});
	it('correctly syncs TimeDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11222"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Time, VictoryType.Score, 12, 999999);
		let server = new Server(serverComms, new TestLASProvider(level, simulation));
		server.loadLevel(1);
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 5; i++) {
			serverComms.addClient();
			serverComms.update();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<TimeDetector>g.failureDetector).timeRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
		}
	});
});