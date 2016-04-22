///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import GameEndDetector = require('../../app/Simulation/Levels/gameEndDetector')
import FailureType = require('../../app/Simulation/Levels/failureType')
import LevelDef = require('../../app/Simulation/Levels/levelDef')
import TestUtil = require('../util/util');
import VictoryType = require('../../app/Simulation/Levels/victoryType')

let playerId1 = 99;

describe('GetToBottom.GetThingToBottom', () => {
    it('Works when the thing falls to the bottom', () => {
		let simulation = TestUtil.prepareForTest([
			"92B6",
			"7215",
			"8414",
			"3129"
		]);
		let level = new LevelDef(1, 4, 4, [], 10, FailureType.Time, VictoryType.GetThingToBottom, 99999, 2);
		let gameEndDetector = new GameEndDetector(level, simulation);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[1][0], simulation.grid.cells[2][0]);
		for (let i = 0; i < 3; i++)
			simulation.update();

		expect(gameEndDetector.gameHasEnded).toBe(true);
		expect(gameEndDetector.gameEndedInVictory).toBe(true);
		TestUtil.expectGridQuiet(simulation);
	});

    it('Works when the thing is swapped to the bottom', () => {
		let simulation = TestUtil.prepareForTest([
			"11B6",
			"3519"
		]);
		let level = new LevelDef(1, 4, 2, [], 10, FailureType.Time, VictoryType.GetThingToBottom, 99999, 2);
		let gameEndDetector = new GameEndDetector(level, simulation);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 3; i++)
			simulation.update();

		expect(gameEndDetector.gameHasEnded).toBe(true);
		expect(gameEndDetector.gameEndedInVictory).toBe(true);
		TestUtil.expectGridQuiet(simulation);
	});
});

describe('GetToBottom.GetThingsToBottom', () => {
    it('Works when the thing falls to the bottom', () => {
		let simulation = TestUtil.prepareForTest([
			"92B6",
			"7215",
			"8414",
			"3129"
		]);
		let level = new LevelDef(1, 4, 4, [], 10, FailureType.Time, VictoryType.GetThingsToBottom, 99999, [2]);
		let gameEndDetector = new GameEndDetector(level, simulation);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[1][0], simulation.grid.cells[2][0]);
		for (let i = 0; i < 3; i++)
			simulation.update();

		expect(gameEndDetector.gameHasEnded).toBe(true);
		expect(gameEndDetector.gameEndedInVictory).toBe(true);
		TestUtil.expectGridQuiet(simulation);
	});

    it('Works when the thing is swapped to the bottom', () => {
		let simulation = TestUtil.prepareForTest([
			"11B6",
			"3519"
		]);
		let level = new LevelDef(1, 4, 2, [], 10, FailureType.Time, VictoryType.GetThingsToBottom, 99999, [2]);
		let gameEndDetector = new GameEndDetector(level, simulation);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 3; i++)
			simulation.update();

		expect(gameEndDetector.gameHasEnded).toBe(true);
		expect(gameEndDetector.gameEndedInVictory).toBe(true);
		TestUtil.expectGridQuiet(simulation);
	});
});