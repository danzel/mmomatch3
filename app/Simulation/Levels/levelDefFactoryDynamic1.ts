import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactoryDynamic = require('./levelDefFactoryDynamic');
import RandomGenerator = require('../randomGenerator');
import VictoryType = require('./victoryType');

class LevelDefFactoryDynamic1 extends LevelDefFactoryDynamic {
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
		let gen = new RandomGenerator(100 + levelNumber);

		let extraData = <any>{ playerCount: this.playerCount };

		//Do these first as they don't use variable random numbers
		let victoryType = <VictoryType>(levelNumber % VictoryType.Count);//gen.intExclusive(0, VictoryType.Count);
		let failureType = <FailureType>gen.intExclusive(0, FailureType.Count);
		let size = this.generateSize(levelNumber, victoryType, failureType, gen);
		let colorCount: number = this.generateColorCount(levelNumber, size, gen);

		//Pigs Vs Pugs!
		if (victoryType == VictoryType.MatchXOfColor) {
			failureType = FailureType.MatchXOfColor;
		}

		let holes = this.generateHoles(levelNumber, size, victoryType, gen);
		let failureValue = this.generateFailureValue(levelNumber, failureType, gen);
		let victoryValue = this.generateVictoryValue(levelNumber, victoryType, failureType, failureValue, colorCount, size, holes, gen, extraData);

		//HACK: This changes the height, so redo the holes
		if (victoryType == VictoryType.GetThingToBottom) {
			holes = this.generateHoles(levelNumber, size, victoryType, gen);
		}

		let level = new LevelDef(levelNumber, size.width, size.height, holes, colorCount, failureType, victoryType, failureValue, victoryValue);
		level.extraData = extraData;
		return level;
	}

	private generateSize(levelNumber: number, victoryType: VictoryType, failureType: FailureType, gen: RandomGenerator): { width: number, height: number } {

		if (victoryType == VictoryType.GetThingToBottom) {
			//Make a tall level
			return { width: gen.intExclusive(5, 20), height: gen.intExclusive(30, 100) };
		}
		if (victoryType == VictoryType.RequireMatch) {
			//Don't be too big so players can find the things
			return { width: gen.intExclusive(10, 80), height: gen.intExclusive(10, 80) };
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
				return 5;
			case 7:
				return 3;
			case 8:
				return 2;
			case 9:
				return 1.5;
			case 10:
				return 1.3;
			case 11:
				return 1;
		}
	}

	private specificDifficultyScale(victoryType: VictoryType, failureType: FailureType, colorCount: number, size: { width: number, height: number }): number {
		let res = 1;

		if (victoryType == VictoryType.Matches || victoryType == VictoryType.Score) {
			res *= this.difficultyForColorCount(colorCount) * this.difficultyForColorCount(colorCount);
			res *= size.height / 30;
		}
		if (victoryType == VictoryType.RequireMatch) {
			res *= this.difficultyForColorCount(colorCount);
		}

		return res;
	}

	private generateVictoryValue(levelNumber: number, victoryType: VictoryType, failureType: FailureType, failureValue: any, colorCount: number, size: { width: number, height: number }, holes: Array<{ x: number, y: number }>, gen: RandomGenerator, extraData: any): any {

		//Bigger scale = easier
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
		let specificDifficultyScale = this.specificDifficultyScale(victoryType, failureType, colorCount, size);
		let scale = colorCountScale * failureScale * randomDifficultyScale * specificDifficultyScale;
		extraData.difficulty = randomDifficultyScale;
		extraData.scale = scale;

		//console.log(colorCountScale, failureScale, randomDifficultyScale, specificDifficultyScale, scale);

		switch (victoryType) {
			case VictoryType.GetThingToBottom:
				//TODO: We may need to recalculate the height based on what the failure is
				size.height = Math.floor(scale / 8);
				return Math.floor(size.width / 2);
			case VictoryType.GetThingsToBottom:
				return this.generateGetThingsToBottomVictoryValue(size.width, scale, gen);
			case VictoryType.Matches:
				return Math.floor(1.2 * scale);
			case VictoryType.RequireMatch:
				return this.generateRequireMatchVictoryValue(levelNumber, size, holes, gen, Math.floor(scale / 7));
			case VictoryType.Score:
				return Math.floor(scale * 300);
			case VictoryType.MatchXOfColor:
				return { color: 3, amount: failureValue.amount };
		}
	}

	private generateRequireMatchVictoryValue(levelNumber: number, size: { width: number, height: number }, holes: Array<{ x: number, y: number }>, gen: RandomGenerator, count: number): Array<{ x: number, y: number, amount: number }> {
		let res = new Array<{ x: number, y: number, amount: number }>();

		for (let i = 0; i < count; i++) {
			let x = gen.intExclusive(0, size.width);
			let y = gen.intExclusive(0, size.height);

			if (!this.contains(res, x, y) && !this.contains(holes, x, y) && !this.isBadPositionForRequireMatch(x, y, size)) {
				res.push({ x: x, y: y, amount: 1 });
			}
		}

		return res;
	}

	private isBadPositionForRequireMatch(x: number, y: number, size: { width: number, height: number }): boolean {
		//Top row
		if (y == size.height - 1) {
			return true;
		}
		//Bottom corners
		if (y == 0 && (x == 0 || x == size.width - 1)) {
			return true;
		}

		return false;
	}

	private generateGetThingsToBottomVictoryValue(width: number, scale: number, gen: RandomGenerator): Array<number> {
		let res = new Array<number>();

		let approxAmount = scale * 0.005;
		let approxSpacing = width / approxAmount;

		let increment = Math.round(width / (Math.round(approxAmount) + 1));
		let mode = gen.intExclusive(0, 2);

		if (mode == 1 && increment > 1) { //random wobble mode
			let halfIncrement = Math.round(increment / 2);
			for (let x = -1; x < width; x += increment + gen.intExclusive(-halfIncrement, halfIncrement + 1)) {
				
				if (x >= 0) {
					res.push(x);
				}
			}
		} else { //Evenly spaced mode
			for (let x = increment; x < width; x += increment) {
				res.push(x);
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
				return 20 + this.playerCount * gen.intInclusive(10, 30); //20 + players * (10 - 30)
			case FailureType.Time:
				return gen.intInclusive(1, 4) * 30; //30 - 120
			case FailureType.MatchXOfColor:
				return { color: 5, amount: 50 + this.playerCount * gen.intInclusive(3, 10) }; //50 + players * (3 - 10)
			default:
				throw new Error("GFV Don't know FailureType " + failureType);
		}
	}
}

export = LevelDefFactoryDynamic1;