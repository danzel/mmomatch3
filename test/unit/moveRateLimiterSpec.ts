///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import MoveRateLimiter = require('../../app/server/moveRateLimiter');

describe('MoveRateLimiter', () => {
	it('allows a first move', () => {
		let moveRateLimiter = new MoveRateLimiter(2);

		expect(moveRateLimiter.limitCheck(1, 0)).toBe(true);
	});

	it('allows 2 moves in one second', () => {
		let moveRateLimiter = new MoveRateLimiter(2);

		expect(moveRateLimiter.limitCheck(1, 0)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 0.5)).toBe(true);
	});

	it('stops 3 moves in one second', () => {
		let moveRateLimiter = new MoveRateLimiter(2);

		expect(moveRateLimiter.limitCheck(1, 0)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 0.3)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 0.4)).toBe(false);
		expect(moveRateLimiter.limitCheck(1, 0.6)).toBe(false);
		expect(moveRateLimiter.limitCheck(1, 0.9)).toBe(false);
	});

	it('allows 3 moves in two seconds', () => {
		let moveRateLimiter = new MoveRateLimiter(2);

		expect(moveRateLimiter.limitCheck(1, 0)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 0.3)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 1.1)).toBe(true);
	});

	it('allows 5 moves spread', () => {
		let moveRateLimiter = new MoveRateLimiter(2);

		expect(moveRateLimiter.limitCheck(1, 0)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 0.3)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 1.1)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 1.4)).toBe(true);
		expect(moveRateLimiter.limitCheck(1, 2.2)).toBe(true);
	});

	it('allows 3 moves in one second from multiple people', () => {
		let moveRateLimiter = new MoveRateLimiter(2);

		expect(moveRateLimiter.limitCheck(1, 0)).toBe(true);
		expect(moveRateLimiter.limitCheck(2, 0.3)).toBe(true);
		expect(moveRateLimiter.limitCheck(3, 0.9)).toBe(true);
	});
});
