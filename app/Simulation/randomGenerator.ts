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
}

export = RandomGenerator;