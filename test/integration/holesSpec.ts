///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import Grid = require('../../app/Simulation/grid');
import InputVerifier = require('../../app/Simulation/inputVerifier');
import MagicNumbers = require('../../app/Simulation/magicNumbers');
import Matchable = require('../../app/Simulation/matchable');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import OwnershipMatchChecker = require('../util/ownershipMatchChecker');
import Physics = require('../../app/Simulation/physics');
import RandomGenerator = require('../../app/Simulation/randomGenerator');
import Simulation = require('../../app/Simulation/simulation');
import SpawningSpawnManager = require('../../app/Simulation/spawningSpawnManager');
import SwapHandler = require('../../app/Simulation/swapHandler');
import Type = require('../../app/Simulation/type');
import TestUtil = require('../util/util');

describe('Holes', () => {
	it('initially spawns the right amount of matchables', () => {
		let matchableFactory = new MatchableFactory();
		let randomGenerator = new RandomGenerator();

		let grid = new Grid(3, 3);
		grid.setHole(0, 0);

		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, randomGenerator, 4);
		spawnManager.update();

		expect(grid.cells[0].length).toBe(2);
		expect(grid.cells[1].length).toBe(3);
		expect(grid.cells[2].length).toBe(3);
	});

	it('matchables dont land in a bottom hole position', () => {
		let grid = new Grid(2, 2);
		grid.setHole(0, 0);

		let physics = new Physics(grid);
		let matchable = new Matchable(1, 0, 2 * MagicNumbers.matchableYScale, 0, Type.Normal);
		grid.cells[0].push(matchable);

		for (let i = 0; i < 11; i++) {
			physics.updateMomentum();
			physics.updateMovement();
		}

		expect(matchable.y).toBe(MagicNumbers.matchableYScale);
		expect(matchable.yMomentum).toBe(0);
	});

	it('matchables fall through a hole when there is space beneath it', () => {
		let grid = new Grid(1, 3);
		grid.setHole(0, 1);

		let physics = new Physics(grid);
		let matchable = new Matchable(1, 0, 4 * MagicNumbers.matchableYScale, 0, Type.Normal);
		grid.cells[0].push(matchable);

		for (let i = 0; i < 22; i++) {
			physics.updateMomentum();
			physics.updateMovement();
		}

		expect(matchable.y).toBe(0);
		expect(matchable.yMomentum).toBe(0);
	});

	it('matchables dont fall through a hole when there is no space beneath it', () => {
		let grid = new Grid(1, 3);
		grid.setHole(0, 1);

		let physics = new Physics(grid);
		let matchable = new Matchable(1, 0, 4 * MagicNumbers.matchableYScale, 0, Type.Normal);
		grid.cells[0].push(matchable);
		let matchable2 = new Matchable(2, 0, 5 * MagicNumbers.matchableYScale, 0, Type.Normal);
		grid.cells[0].push(matchable2);

		for (let i = 0; i < 22; i++) {
			physics.updateMomentum();
			physics.updateMovement();
		}

		expect(matchable.y).toBe(0);
		expect(matchable.yMomentum).toBe(0);

		expect(matchable2.y).toBe(2 * MagicNumbers.matchableYScale);
		expect(matchable2.yMomentum).toBe(0);
	});

	it('swaps above holes work vertically', () => {
		let simulation = TestUtil.prepareForTest([
			'1',
			'2',
			'1',
			'1',
			'X'
		]);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);

		expect(inputVerifier.swapIsValid(simulation.grid.cells[0][2], simulation.grid.cells[0][3])).toBe(true);
	});
	it('swaps above holes work vertically2', () => {
		let simulation = TestUtil.prepareForTest([
			'1',
			'1',
			'2',
			'1',
			'X'
		]);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);

		expect(inputVerifier.swapIsValid(simulation.grid.cells[0][0], simulation.grid.cells[0][1])).toBe(true);
	});

	it('swaps above holes work horizontally', () => {
		let simulation = TestUtil.prepareForTest([
			'1211',
			'X456'
		]);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);

		expect(inputVerifier.swapIsValid(simulation.grid.cells[0][0], simulation.grid.cells[1][1])).toBe(true);
	});

	it('swaps above holes work horizontally2', () => {
		let simulation = TestUtil.prepareForTest([
			'1211',
			'3X56'
		]);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);

		expect(inputVerifier.swapIsValid(simulation.grid.cells[0][1], simulation.grid.cells[1][0])).toBe(true);
	});

	it('swaps above holes work horizontally3', () => {
		let simulation = TestUtil.prepareForTest([
			'1211',
			'34X6'
		]);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);

		expect(inputVerifier.swapIsValid(simulation.grid.cells[0][1], simulation.grid.cells[1][1])).toBe(true);
	});

	it('only disappears the correct matchables', () => {
		let simulation = TestUtil.prepareForTest([
			'7895',
			'789X',
			'2112',
			'34X1'
		]);
		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);

		let left = simulation.grid.cells[3][0];
		let right = simulation.grid.cells[3][1];
		expect(inputVerifier.swapIsValid(left, right)).toBe(true);
		simulation.swapHandler.swap(0, left, right);
		for (let i = 0; i < SwapHandler.TicksToSwap; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [0]);
		ownershipChecker.verifyNoRemainingMatches();

	});

	it('initially spawns with no matches', () => {
		let grid = new Grid(20, 20);
		grid.setHole(1, 18);
		grid.setHole(5, 8);
		grid.setHole(11, 2);
		grid.setHole(18, 0);

		let matchableFactory = new MatchableFactory();
		let randomGenerator = new RandomGenerator(1);
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, randomGenerator, 5);
		let simulation = new Simulation(grid, spawnManager, matchableFactory, 1);

		simulation.matchPerformer.matchPerformed.on(() => { throw new Error("No match should be performed") })

		for (var i = 0; i < 10; i++) {
			simulation.update();
		}
	});

	it('makes matchables fall correctly when there are multiple holes in the same column', () => {
		let grid = new Grid(1, 7);
		grid.setHole(0, 2);
		grid.setHole(0, 5);

		// 4 6
		// X 5
		// 3 4
		// 2 3
		// X 2
		// 1 1
		// 0 0

		let matchableFactory = new MatchableFactory();
		let randomGenerator = new RandomGenerator(1);
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, randomGenerator, 5);
		let simulation = new Simulation(grid, spawnManager, matchableFactory, 0.05);

		simulation.matchPerformer.matchPerformed.on(() => { throw new Error("No match should be performed") });

		for (var i = 0; i < 31; i++) {
			simulation.update();
		}

		expect(grid.cells[0][0].y).toBe(0 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][1].y).toBe(1 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][2].y).toBe(3 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][3].y).toBe(4 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][4].y).toBe(6 * MagicNumbers.matchableYScale);
	});

	it('makes matchables fall correctly when there are multiple holes in the same column in a row', () => {
		let grid = new Grid(1, 7);
		grid.setHole(0, 2);
		grid.setHole(0, 3);
		grid.setHole(0, 4);

		// 3 6
		// 2 5
		// X 4
		// X 3
		// X 2
		// 1 1
		// 0 0

		let matchableFactory = new MatchableFactory();
		let randomGenerator = new RandomGenerator(1);
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, randomGenerator, 5);
		let simulation = new Simulation(grid, spawnManager, matchableFactory, 0.05);

		simulation.matchPerformer.matchPerformed.on(() => { throw new Error("No match should be performed") });

		for (var i = 0; i < 31; i++) {
			simulation.update();
		}

		expect(grid.cells[0][0].y).toBe(0 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][1].y).toBe(1 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][2].y).toBe(5 * MagicNumbers.matchableYScale);
		expect(grid.cells[0][3].y).toBe(6 * MagicNumbers.matchableYScale);
	});
});