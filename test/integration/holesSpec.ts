///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import ComboOwnership = require('../../app/Simulation/Scoring/comboOwnership');
import Grid = require('../../app/Simulation/grid');
import InputVerifier = require('../../app/Simulation/inputVerifier');
import Matchable = require('../../app/Simulation/matchable');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import OwnershipMatchChecker = require('../util/ownershipMatchChecker');
import Physics = require('../../app/Simulation/physics');
import RandomGenerator = require('../../app/Simulation/randomGenerator');
import Simulation = require('../../app/Simulation/simulation');
import SpawningSpawnManager = require('../../app/Simulation/spawningSpawnManager');
import TestUtil = require('../util/util');

describe('Holes', () => {
	it('initially spawns the right amount of matchables', () => {
		let matchableFactory = new MatchableFactory();
		let randomGenerator = new RandomGenerator();

		let grid = new Grid(3, 3);
		grid.setHole(0, 0);

		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, randomGenerator, 4);
		spawnManager.update(1);

		expect(grid.cells[0].length).toBe(2);
		expect(grid.cells[1].length).toBe(3);
		expect(grid.cells[2].length).toBe(3);
	});

	it('matchables dont land in a bottom hole position', () => {
		let grid = new Grid(2, 2);
		grid.setHole(0, 0);

		let physics = new Physics(grid);
		let matchable = new Matchable(1, 0, 2, 0);
		grid.cells[0].push(matchable);

		physics.update(1);

		expect(matchable.y).toBe(1);
		expect(matchable.yMomentum).toBe(0);
	});

	it('matchables fall through a hole when there is space beneath it', () => {
		let grid = new Grid(1, 3);
		grid.setHole(0, 1);

		let physics = new Physics(grid);
		let matchable = new Matchable(1, 0, 4, 0);
		grid.cells[0].push(matchable);

		physics.update(10);

		expect(matchable.y).toBe(0);
		expect(matchable.yMomentum).toBe(0);
	});

	it('matchables dont fall through a hole when there is no space beneath it', () => {
		let grid = new Grid(1, 3);
		grid.setHole(0, 1);

		let physics = new Physics(grid);
		let matchable = new Matchable(1, 0, 4, 0);
		grid.cells[0].push(matchable);
		let matchable2 = new Matchable(2, 0, 5, 0);
		grid.cells[0].push(matchable2);

		physics.update(10);

		expect(matchable.y).toBe(0);
		expect(matchable.yMomentum).toBe(0);

		expect(matchable2.y).toBe(2);
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
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, simulation.quietColumnDetector);
		let ownershipChecker = new OwnershipMatchChecker(ownership);
		let inputVerifier = new InputVerifier(simulation.grid, simulation.matchChecker, true);
		
		let left = simulation.grid.cells[3][0];
		let right = simulation.grid.cells[3][1];
		expect(inputVerifier.swapIsValid(left, right)).toBe(true);
		simulation.swapHandler.swap(0, left, right);
		simulation.update(1);
		simulation.update(1);
		simulation.update(1);
		
		ownershipChecker.verifyMatch(3, [0]);
		ownershipChecker.verifyNoRemainingMatches();
		
	});

	it('initially spawns with no matches', () => {
		expect(false).toBe(true);
	});

	it('initially spawns with the holes in so that falling looks correct?', () => {
		expect(false).toBe(true);
	});
});