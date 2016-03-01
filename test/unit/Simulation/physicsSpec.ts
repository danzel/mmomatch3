///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Grid = require('../../../app/Simulation/grid');
import Matchable = require('../../../app/Simulation/matchable');
import Physics = require('../../../app/Simulation/physics');
import Type = require('../../../app/Simulation/type');

describe('Physics', () => {
	let grid: Grid;
	let physics: Physics;

	beforeEach(() => {
		grid = new Grid(1, 1);
		physics = new Physics(grid);
	});

	it('makes Matchables fall', () => {
		let m = new Matchable(1, 0, 1, 1, Type.Normal);

		grid.cells[0].push(m);
		physics.updateMomentum(1 / 60);

		expect(m.isMoving).toBe(true);
	});

	it('doesnt make disappearing Matchables fall', () => {
		let m = new Matchable(1, 0, 1, 1, Type.Normal);
		m.isDisappearing = true;

		grid.cells[0].push(m);
		physics.updateMomentum(1 / 60);

		expect(m.isMoving).toBe(false);
	});

	it('doesnt make swapping Matchables fall', () => {
		let m = new Matchable(1, 0, 1, 1, Type.Normal);
		m.beingSwapped = true;

		grid.cells[0].push(m);
		physics.updateMomentum(1 / 60);

		expect(m.isMoving).toBe(false);
	});
});
