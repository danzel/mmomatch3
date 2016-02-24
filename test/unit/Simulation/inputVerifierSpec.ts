///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import InputVerifier = require('../../../app/Simulation/inputVerifier');
import Grid = require('../../../app/Simulation/grid');
import Matchable = require('../../../app/Simulation/matchable');
import MatchChecker = require('../../../app/Simulation/matchChecker');
import TestUtil = require('../../util/util');

let inputVerifier: InputVerifier;
let expectValidSwap = function(a: Matchable, b: Matchable, canSwap: boolean) {
	expect(inputVerifier.swapIsValid(a, b)).toBe(canSwap);
	expect(inputVerifier.swapIsValid(b, a)).toBe(canSwap);
}

describe('InputVerifier', () => {
	function init() {
		inputVerifier = new InputVerifier(null, null, TestUtil.gameNeverOver(), false);
	}
    it('Can swap two horizontal neighbours', () => {
		init();
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);
		expectValidSwap(left, right, true);
    });

    it('Can swap two vertical neighbours', () => {
		init();
		var up = new Matchable(1, 2, 0, 0);
		var down = new Matchable(1, 2, 1, 0);
		expectValidSwap(up, down, true);
    });

    it('Cannot swap two diagonal neighbours', () => {
		init();
		var a = new Matchable(1, 2, 0, 0);
		var b = new Matchable(1, 3, 1, 0);
		expectValidSwap(a, b, false);
    });

    it('Cannot swap with itself', () => {
		init();
		var a = new Matchable(1, 2, 0, 0);
		expectValidSwap(a, a, false);
    });


    it('Cannot swap if one is moving', () => {
		init();
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);

		left.yMomentum = 1;

		expectValidSwap(left, right, false);
    });

    it('Cannot swap if one is disappearing', () => {
		init();
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);

		left.isDisappearing = true;

		expectValidSwap(left, right, false);
    });

    it('Cannot swap if one is being swapped', () => {
		init();
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);

		left.beingSwapped = true;

		expectValidSwap(left, right, false);
    });
});


describe('InputVerifier.requireSwapsToMakeMatches', () => {
	let grid: Grid;
	function baseInit() {
		grid = new Grid(3, 3);
		inputVerifier = new InputVerifier(grid, new MatchChecker(grid), TestUtil.gameNeverOver(), true);
	}
	
	describe('on a 3x3 grid', () => {
		
		function init() {
			baseInit();
			TestUtil.populateGrid(grid, [
				"001",
				"001",
				"212"
			]);
		}
			
		it('can swap to make a simple match', () => {
			init();
			expectValidSwap(grid.cells[1][0], grid.cells[2][0], true);
		});

		it('cant swap when it wont match', () => {
			init();
			expectValidSwap(grid.cells[0][0], grid.cells[1][0], false);
		});
	});
});