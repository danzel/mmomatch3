///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import InputVerifier = require('../../../app/Simulation/inputVerifier');
import Matchable = require('../../../app/Simulation/matchable');

describe('InputVerifier', () => {
	let swapHandler = new InputVerifier(null);
	let expectValidSwap = function(a: Matchable, b: Matchable, canSwap: boolean) {
		expect(swapHandler.swapIsValid(a, b)).toBe(canSwap);
		expect(swapHandler.swapIsValid(b, a)).toBe(canSwap);
	}

    it('Can swap two horizontal neighbours', () => {
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);
		expectValidSwap(left, right, true);
    });

    it('Can swap two vertical neighbours', () => {
		var up = new Matchable(1, 2, 0, 0);
		var down = new Matchable(1, 2, 1, 0);
		expectValidSwap(up, down, true);
    });

    it('Cannot swap two diagonal neighbours', () => {
		var a = new Matchable(1, 2, 0, 0);
		var b = new Matchable(1, 3, 1, 0);
		expectValidSwap(a, b, false);
    });

    it('Cannot swap with itself', () => {
		var a = new Matchable(1, 2, 0, 0);
		expectValidSwap(a, a, false);
    });


    it('Cannot swap if one is moving', () => {
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);

		left.yMomentum = 1;

		expectValidSwap(left, right, false);
    });

    it('Cannot swap if one is disappearing', () => {
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);

		left.isDisappearing = true;

		expectValidSwap(left, right, false);
    });

    it('Cannot swap if one is being swapped', () => {
		var left = new Matchable(1, 2, 0, 0);
		var right = new Matchable(1, 3, 0, 0);

		left.beingSwapped = true;

		expectValidSwap(left, right, false);
    });
});