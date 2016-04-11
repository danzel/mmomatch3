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
			this.debugPrintLevel(this.levels[i]);
		}
	}

	private debugPrintLevel(level: LevelDef) {
		console.log(level.levelNumber, level.width + 'x' + level.height, level.colorCount);
		console.log(VictoryType[level.victoryType], (level.victoryValue.length || level.victoryValue), FailureType[level.failureType], level.failureValue);
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
		let colorCount: number = this.generateColorCount(levelNumber, size, gen);

		let holes = this.generateHoles(levelNumber, size, victoryType, gen);
		let victoryValue = this.generateVictoryValue(levelNumber, victoryType, size, holes, gen);
		let failureValue = this.generateFailureValue(levelNumber, failureType, size, victoryType, victoryValue, gen);

		return new LevelDef(levelNumber, size.width, size.height, holes, colorCount, failureType, victoryType, failureValue, victoryValue);
	}

	private generateSize(levelNumber: number, victoryType: VictoryType, failureType: FailureType, gen: RandomGenerator): { width: number, height: number } {

		if (victoryType == VictoryType.GetThingToBottom) {
			//Make a tall level
			return { width: gen.intExclusive(5, 20), height: gen.intExclusive(30, 100) };
		}
		if (victoryType == VictoryType.RequireMatch) {
			//Don't be too big so players can find the things
			return { width: gen.intExclusive(10, 50), height: gen.intExclusive(10, 50) };
		}

		return { width: gen.intExclusive(10, 250), height: gen.intExclusive(10, 80) };
	}

	private generateColorCount(levelNumber: number, size: { width: number, height: number }, gen: RandomGenerator): number {
		//Normally we want 8
		//but could have +/-2
		let defaultCount = 8;

		let rnd = gen.intExclusive(0, 10);
		switch (rnd) {
			case 0:
				return defaultCount - 2;
			case 1:
				return defaultCount - 1;
			case 3:
				return defaultCount + 1;
			case 4:
				return defaultCount + 2;
			default:
				return defaultCount;
		}
	}

	private generateHoles(levelNumber: number, size: { width: number, height: number }, victoryType: VictoryType, gen: RandomGenerator): Array<{ x: number, y: number }> {
		let res = new Array<{ x: number, y: number }>();

		let holeGen = new RandomGenerator(levelNumber + size.width + size.height);

		let hasCornerCuts = holeGen.intExclusive(0, 10) == 0; //http://candycrush.wikia.com/wiki/Level_32
		let hasHorizontalCuts = holeGen.intExclusive(0, 10) == 0; //http://candycrush.wikia.com/wiki/Level_77
		let hasVerticalCuts = holeGen.intExclusive(0, 10) == 0; //^^ but the other way

		if (hasCornerCuts) {
			let cutSize = Math.floor(Math.min(size.width / 3, size.height / 3));
			cutSize = holeGen.intExclusive(1, cutSize);

			for (let x = 0; x < cutSize; x++) {
				for (let y = 0; y < (cutSize - x); y++) {
					this.addIfNotInAlready(res, x, y);
					this.addIfNotInAlready(res, x, size.height - y - 1);
					this.addIfNotInAlready(res, size.width - x - 1, size.height - y - 1);
					this.addIfNotInAlready(res, size.width - x - 1, y);
				}
			}
		}

		if (hasHorizontalCuts) {
			let cutCount = 2 + Math.floor(size.height / 10);
			cutCount = holeGen.intExclusive(1, cutCount);
			for (let i = 0; i < cutCount; i++) {
				let y = holeGen.intExclusive(1, size.height - 1);
				for (let x = 0; x < size.width; x++) {
					this.addIfNotInAlready(res, x, y);
				}
			}
		}

		if (hasVerticalCuts) {
			let cutCount = 2 + Math.floor(size.width / 20);
			cutCount = holeGen.intExclusive(1, cutCount);
			for (let i = 0; i < cutCount; i++) {
				let x = holeGen.intExclusive(1, size.width / 2 - 1);
				for (let y = 0; y < size.height; y++) {
					this.addIfNotInAlready(res, x, y);
					this.addIfNotInAlready(res, size.width - x - 1, y);
				}
			}
		}

		//console.log(levelNumber, hasCornerCuts, hasHorizontalCuts, hasVerticalCuts);
		return res;
	}

	private addIfNotInAlready(holes: Array<{ x: number, y: number }>, x: number, y: number) {
		holes.forEach((hole) => {
			if (hole.x == x && hole.y == y) {
				return;
			}
		});
		holes.push({ x: x, y: y });
	}

	private generateVictoryValue(levelNumber: number, victoryType: VictoryType, size: { width: number, height: number }, holes: Array<{ x: number, y: number }>, gen: RandomGenerator): any {
		switch (victoryType) {
			case VictoryType.GetThingToBottom:
				return Math.floor(size.width / 2);
			case VictoryType.Matches:
				return gen.intExclusive(100, 100 + 4 * size.width * size.height)
			case VictoryType.RequireMatch:
				return this.generateRequireMatchVictoryValue(levelNumber, size, holes, gen);
			case VictoryType.Score:
				return 1000 * gen.intExclusive(100, 100 + size.height * 50);
		}
	}

	private generateRequireMatchVictoryValue(levelNumber: number, size: { width: number, height: number }, holes: Array<{ x: number, y: number }>, gen: RandomGenerator): Array<{ x: number, y: number, amount: number }> {
		let res = new Array<{ x: number, y: number, amount: number }>();

		let count = gen.intExclusive(10, size.width * size.height / 2 - holes.length);

		for (let i = 0; i < count; i++) {
			let x = gen.intExclusive(0, size.width);
			let y = gen.intExclusive(0, size.height);

			if (!this.contains(res, x, y) && !this.contains(holes, x, y)) {
				res.push({ x: x, y: y, amount: 1 });
			}
		}

		return res;
	}

	private contains(arr: Array<{ x: number, y: number }>, x: number, y: number): boolean {
		return arr.some(i => i.x == x && i.y == y);
	}

	private generateFailureValue(levelNumber: number, failureType: FailureType, size: { width: number, height: number }, victoryType: VictoryType, victoryValue: any, gen: RandomGenerator): any {
		switch (failureType) {
			case FailureType.Swaps:
				return Math.round(this.estimateRequiredSwaps(victoryType, victoryValue, size, gen) / 10) * 10;
			case FailureType.Time:
				return Math.round(this.estimateRequiredTime(victoryType, victoryValue, size, gen) / 30) * 30;
		}
	}

	private estimateRequiredSwaps(victoryType: VictoryType, victoryValue: any, size: { width: number, height: number }, gen: RandomGenerator): number {
		switch (victoryType) {
			case VictoryType.GetThingToBottom:
				return size.height * gen.intExclusive(1, 10) / 5;
			case VictoryType.Matches:
				return <number>victoryValue / gen.intExclusive(3, 12);
			case VictoryType.RequireMatch:
				return 10 + (<[]>victoryValue).length / gen.intExclusive(2, 5);
			case VictoryType.Score:
				return <number>victoryValue / gen.intExclusive(1000, 3000);
		}
	}

	private estimateRequiredTime(victoryType: VictoryType, victoryValue: any, size: { width: number, height: number }, gen: RandomGenerator): number {
		switch (victoryType) {
			case VictoryType.GetThingToBottom:
				return size.height * gen.intExclusive(10, 40) / 10;
			case VictoryType.Matches:
				return <number>victoryValue / gen.intExclusive(3, 20);
			case VictoryType.RequireMatch:
				return 30 + (<[]>victoryValue).length * gen.intExclusive(1, 5) / 6;
			case VictoryType.Score:
				return 10 + <number>victoryValue / gen.intExclusive(20000, 30000);
		}
	}
}

export = LevelDefFactoryPreview1;