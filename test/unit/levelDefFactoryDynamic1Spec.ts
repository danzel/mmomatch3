///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import LevelFactoryDynamic1 = require('../../app/Simulation/Levels/levelDefFactoryDynamic1');

describe('LevelFactoryDynamic1', () => {
	it('can generate 100 levels', () => {
		let gen = new LevelFactoryDynamic1();

		for (let i = 1; i <= 100; i++) {
			gen.getLevel(i);
		}
	})
});