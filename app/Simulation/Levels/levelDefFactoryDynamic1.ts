import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactory = require('./levelDefFactory');
import RandomGenerator = require('../randomGenerator');
import VictoryType = require('./victoryType');

class LevelDefFactoryDynamic1 implements LevelDefFactory {
	playerCount = 10;

	private debugPrintLevel(level: LevelDef) {
		console.log(level.levelNumber, level.width + 'x' + level.height, level.colorCount);
		console.log(VictoryType[level.victoryType], (level.victoryValue.length || level.victoryValue), FailureType[level.failureType], level.failureValue);
	}

	getLevel(levelNumber: number): LevelDef {
		let level = this.generateLevel(levelNumber);
		this.debugPrintLevel(level);
		return level;
	}

	private generateLevel(levelNumber: number): LevelDef {
		let gen = new RandomGenerator(levelNumber);

		//Do these first as they don't use variable random numbers
		let victoryType = <VictoryType>gen.intExclusive(0, VictoryType.Count);
		let failureType = <FailureType>gen.intExclusive(0, FailureType.Count);
		let size = this.generateSize(levelNumber, victoryType, failureType, gen);
		let colorCount: number = this.generateColorCount(levelNumber, size, gen);

		let holes = this.generateHoles(levelNumber, size, victoryType, gen);
		let failureValue = this.generateFailureValue(levelNumber, failureType, gen);
		let victoryValue = this.generateVictoryValue(levelNumber, victoryType, failureType, failureValue, colorCount, size, holes, gen);

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
		if (!holes.some((hole) => hole.x == x && hole.y == y)) {
			holes.push({ x: x, y: y });
		}
	}

	private difficultyForColorCount(colorCount: number): number {
		switch (colorCount) {
			case 6:
				return 3;
			case 7:
				return 2;
			case 8:
				return 1;
			case 9:
				return 0.95;
			case 10:
				return 0.9;
			case 11:
				return 0.85;
		}
	}
	
	private specificDifficultyScale(victoryType: VictoryType, failureType: FailureType, colorCount: number): number {
		let res = 1;
		
		if (victoryType == VictoryType.Matches || victoryType == VictoryType.Score) {
			res *= this.difficultyForColorCount(colorCount) * this.difficultyForColorCount(colorCount) * this.difficultyForColorCount(colorCount);
		}
		if (victoryType == VictoryType.RequireMatch) {
			res *= this.difficultyForColorCount(colorCount);
		}
		
		return res;
	}
	
	private generateVictoryValue(levelNumber: number, victoryType: VictoryType, failureType: FailureType, failureValue: any, colorCount: number, size: { width: number, height: number }, holes: Array<{ x: number, y: number }>, gen: RandomGenerator): any {

		let colorCountScale = this.difficultyForColorCount(colorCount);
		let failureScale: number;
		switch (failureType) {
			case FailureType.Swaps:
				failureScale = <number>failureValue;
				break;
			case FailureType.Time:
				failureScale = <number>failureValue * ((this.playerCount + 0.5) / 1.5);
				break;
		}
		let randomDifficultyScale = gen.intExclusive(80, 150) / 100;
		let specificDifficultyScale = this.specificDifficultyScale(victoryType, failureType, colorCount);
		let scale = colorCountScale * failureScale * randomDifficultyScale * specificDifficultyScale;

		switch (victoryType) {
			case VictoryType.GetThingToBottom:
				//TODO: We may need to recalculate the height based on what the failure is
				return Math.floor(size.width / 2);
			case VictoryType.Matches:
				return Math.floor(10 * scale);
			case VictoryType.RequireMatch:
				return this.generateRequireMatchVictoryValue(levelNumber, size, holes, gen, Math.floor(scale / 3));
			case VictoryType.Score:
				return Math.floor(scale * 300);
		}
	}

	private generateRequireMatchVictoryValue(levelNumber: number, size: { width: number, height: number }, holes: Array<{ x: number, y: number }>, gen: RandomGenerator, count: number): Array<{ x: number, y: number, amount: number }> {
		let res = new Array<{ x: number, y: number, amount: number }>();

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

	private generateFailureValue(levelNumber: number, failureType: FailureType, gen: RandomGenerator): any {
		switch (failureType) {
			case FailureType.Swaps:
				return 10 * gen.intExclusive(5, 51); //50 - 500
			case FailureType.Time:
				return gen.intExclusive(1, 5) * 30; //30 - 120
		}
	}
}

export = LevelDefFactoryDynamic1;