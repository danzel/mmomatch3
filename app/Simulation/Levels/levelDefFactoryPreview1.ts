import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactory = require('./levelDefFactory');
import RandomGenerator = require('../randomGenerator');
import VictoryType = require('./victoryType');

class LevelDefFactoryPreview1 implements LevelDefFactory {
	levelCount = 100;
	levels = new Array<LevelDef>();

	constructor() {
		for (let i = 0; i < this.levelCount; i++) {
			this.levels.push(this.generateLevel(i + 1));
		}
	}

	getLevel(levelNumber: number): LevelDef {
		return this.levels[levelNumber - 1]; //levelNumber starts 1
	}

	private generateLevel(levelNumber: number): LevelDef {
		let gen = new RandomGenerator(levelNumber);

		//Do these first as they don't use variable random numbers
		let victoryType = <VictoryType>gen.intExclusive(0, VictoryType.Count);
		let failureType = <FailureType>gen.intExclusive(0, FailureType.Count);
		let size = this.generateSize(levelNumber, victoryType, failureType, gen);
		let colorCount: number;

		let holes: Array<{ x: number, y: number }>;
		let failureValue;
		let victoryValue;

		return new LevelDef(levelNumber, size.width, size.height, holes, colorCount, failureType, victoryType, failureValue, victoryValue);
	}

	private generateSize(levelNumber: number, victoryType: VictoryType, failureType: FailureType, gen: RandomGenerator): { width: number, height: number } {
		//TODO
		return { width: 0, height: 0 };
	}
}

export = LevelDefFactoryPreview1;