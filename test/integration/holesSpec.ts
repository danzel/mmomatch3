///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import Grid = require('../../app/Simulation/grid');
import Matchable = require('../../app/Simulation/matchable');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import Physics = require('../../app/Simulation/physics');
import RandomGenerator = require('../../app/Simulation/randomGenerator');
import Simulation = require('../../app/Simulation/simulation');
import SpawningSpawnManager = require('../../app/Simulation/spawningSpawnManager');

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
	
	it('matches above holes work', () => {
		expect(false).toBe(true);
	});

	it('swaps above holes work', () => {
		expect(false).toBe(true);
	});

	it('initially spawns with the holes in so that falling looks correct?', () => {
		expect(false).toBe(true);
	});

});