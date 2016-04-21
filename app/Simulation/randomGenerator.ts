/// <reference path="../../typings/mersenne-twister/mersenne-twister.d.ts" />
import MersenneTwister = require('mersenne-twister');

class RandomGenerator {
	private generator: MersenneTwister;

	constructor(seed?: number) {
		this.generator = new MersenneTwister(seed);
	}

	intExclusive(min: number, maxExcluded: number): number {
		return min + Math.floor((maxExcluded - min) * this.generator.random());
	}

	intInclusive(min: number, max: number): number {
		return this.intExclusive(min, max + 1);
	}
}

export = RandomGenerator;