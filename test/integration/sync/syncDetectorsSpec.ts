///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import FailureType = require('../../../app/Simulation/Levels/failureType');
import FakeServerComms = require('../../util/fakeServerComms');
import GameEndType = require('../../../app/Simulation/Levels/gameEndType');
import LevelDef = require('../../../app/Simulation/Levels/levelDef');
import Matchable = require('../../../app/Simulation/matchable');
import Server = require('../../../app/Server/server');
import Simulation = require('../../../app/Simulation/simulation');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestLASProvider = require('../../util/testLASProvider');
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');
import VictoryType = require('../../../app/Simulation/Levels/victoryType');

import GetThingsToBottomDetector = require('../../../app/Simulation/Levels/Detectors/getThingsToBottomDetector');
import MatchesDetector = require('../../../app/Simulation/Levels/Detectors/matchesDetector');
import MatchXOfColorDetector = require('../../../app/Simulation/Levels/Detectors/matchXOfColorDetector');
import NoMovesDetector = require('../../../app/Simulation/Levels/Detectors/noMovesDetector');
import RequireMatchDetector = require('../../../app/Simulation/Levels/Detectors/requireMatchDetector');
import ScoreDetector = require('../../../app/Simulation/Levels/Detectors/scoreDetector');
import SwapsDetector = require('../../../app/Simulation/Levels/Detectors/swapsDetector');
import TimeDetector = require('../../../app/Simulation/Levels/Detectors/timeDetector');

let serverConfig = { fps: 2, framesPerTick: 2, initialLevel: 1, version: null };

describe('SyncDetectors', () => {
	it('correctly syncs MatchesDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11225"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Matches, 999999, 6);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 2; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<MatchesDetector>g.victoryDetector).matchesRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.LevelVictory);
		}
	});
	it('correctly syncs ScoreDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11225"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Score, 999999, 90);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 2; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<ScoreDetector>g.victoryDetector).scoreRequiredRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.LevelVictory);
		}
	});
	it('correctly syncs SwapsDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11225"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Score, 1, 999999);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2 + 2; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<SwapsDetector>g.failureDetector).swapsRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.LevelFailure);
		}
	});
	it('correctly syncs TimeDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189675",
			"11223393"
		]);
		let level = new LevelDef(1, 8, 2, [], 10, FailureType.Time, VictoryType.Score, 12, 999999);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 10; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<TimeDetector>g.failureDetector).timeRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.LevelFailure);
		}
	});
	it('correctly syncs RequireMatchDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11225"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.RequireMatch, 999999, [{ x: 0, y: 0, amount: 1 }]);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < SwapHandler.TicksToSwap; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<RequireMatchDetector>g.victoryDetector).requireMatches).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.LevelVictory);
		}
	});
	it('correctly syncs MatchXOfColorDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"96165",
			"79511",
			"86185",
			"11837"
		]);
		let level = new LevelDef(1, 5, 4, [], 10, FailureType.MatchXOfColor, VictoryType.MatchXOfColor, { color: 2, amount: 99 }, { color: 1, amount: 6 });
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2 + 2; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		serverComms.getAllSimulations().forEach((sim) => {
			TestUtil.expectGridQuiet(sim);
			TestUtil.expectGridSize(sim.grid, [3, 3, 2, 3, 3]);
		});

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			//Hack in Client randomises which is which, so this doesn't work.
			//expect((<MatchXOfColorDetector>g.victoryDetector).matchesRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect([GameEndType.TeamDefeat, GameEndType.TeamVictory]).toContain(g.gameEndType);
		}
	});
	it('correctly syncs GetThingsToBottomDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"87B8B",
			"86192",
			"87182",
			"21625"
		]);
		let level = new LevelDef(1, 5, 4, [], 10, FailureType.Swaps, VictoryType.GetThingsToBottom, 999999, [2, 4]);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[1][0].id, simulation.grid.cells[2][0].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2 + 1; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		//Swap and do a combo that makes the other stack disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[3][0].id, simulation.grid.cells[4][0].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		serverComms.getAllSimulations().forEach((sim) => {
			TestUtil.expectGridQuiet(sim);
			TestUtil.expectGridSize(sim.grid, [4, 4, 0, 4, 0]);
		});

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			expect((<GetThingsToBottomDetector>g.victoryDetector).amount).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.LevelVictory);
		}
	});

	it('correctly syncs NoMovesDetector', () => {
		let serverComms = new FakeServerComms(1);
		let simulation = TestUtil.prepareForTest([
			"82189",
			"11225"
		]);
		let level = new LevelDef(1, 5, 2, [], 10, FailureType.Swaps, VictoryType.Matches, 999999, 999999);
		let server = new Server(serverComms, new TestLASProvider(level, simulation), serverConfig);
		server.start();
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		//Swap and do a combo that makes some disappear
		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2 + 2; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.flushClients();

		let gameEndDetectors = serverComms.getAllGameEndDetectors();
		for (let i = 0; i < gameEndDetectors.length; i++) {
			let g = gameEndDetectors[i];
			//g.noMovesDetector.update();
			//expect((<NoMovesDetector>g.noMovesDetector).matchesRemaining).toBe(0);
			expect(g.gameHasEnded).toBe(true);
			expect(g.gameEndType).toBe(GameEndType.NoMovesFailure);
		}
	});
});