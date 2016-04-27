import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactoryDynamic = require('./levelDefFactoryDynamic');
import RandomGenerator = require('../randomGenerator');
import VictoryType = require('./victoryType');

const defaultColorCount = 8;

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

		//Do these first as they don't use variable random numbers
		let victoryType = <VictoryType>(levelNumber % VictoryType.Count);//gen.intExclusive(0, VictoryType.Count);
		let failureType = <FailureType>gen.intExclusive(0, FailureType.Count);
		//Pigs Vs Pugs!
		if (victoryType == VictoryType.MatchXOfColor) {
			failureType = FailureType.MatchXOfColor;
		}

		let level = this.generateLevelFromType(levelNumber, victoryType, failureType, gen);
		if (!level.extraData) {
			level.extraData = {};
		}
		level.extraData.playerCount = this.playerCount;

		return level;
	}

	private generateLevelFromType(levelNumber: number, victoryType: VictoryType, failureType: FailureType, gen: RandomGenerator): LevelDef {
		switch (victoryType) {
			case VictoryType.GetThingsToBottom:
				return this.generateLevelGetThingsToBottom(levelNumber, failureType, gen);
			case VictoryType.Matches:
				return this.generateLevelMatches(levelNumber, failureType, gen);
			case VictoryType.MatchXOfColor:
				return this.generateLevelMatchXOfColor(levelNumber, gen);
			case VictoryType.RequireMatch:
				return this.generateLevelRequireMatch(levelNumber, failureType, gen);
			case VictoryType.Score:
				return this.generateLevelScore(levelNumber, failureType, gen);
		}

		throw new Error("Cannot generate level for type " + victoryType + " " + VictoryType[victoryType]);
	}

	private generateLevelGetThingsToBottom(levelNumber: number, failureType: FailureType, gen: RandomGenerator): LevelDef {
		let amount = 2 + (this.playerCount / 2);
		//Clamp to 2 - this.playerCount
		amount = Math.min(this.playerCount, amount = Math.max(2, amount));

		let size = { width: Math.min(250, amount * gen.intInclusive(6, 11)), height: gen.intInclusive(30, 50) };
		let colorCount = this.randomColorCount(gen, defaultColorCount - 1); //Less colors, gets hard when robot is near bottom

		//Calculate failure value
		let difficulty = this.calculateColorDifficulty(colorCount, defaultColorCount - 1);

		//TODO: Randomness
		let failureValue: number;
		switch (failureType) {
			case FailureType.Swaps:
				failureValue = Math.round(size.height * amount * (1 / difficulty) * 1.4 / 10) * 10;
				break;
			case FailureType.Time:
				failureValue = Math.round(size.height * amount * 3 / this.playerCount / 10) * 10;
				break;
			default:
				throw new Error("generateLevelGetThingsToBottom FailureType " + failureType + " " + FailureType[failureType])
		}

		//Calculate victory value
		let victoryValue = new Array<number>();
		for (var i = 1; i <= amount; i++) {
			victoryValue.push(Math.round(i * size.width / (amount + 1)));
		}

		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.GetThingsToBottom, failureValue, victoryValue);
	}

	private generateLevelMatches(levelNumber: number, failureType: FailureType, gen: RandomGenerator): LevelDef {
		let size = this.randomSize(gen);
		let colorCount = this.randomColorCount(gen);
		let failureValue = this.randomFailureValue(failureType, gen);

		//Now calculate the victoryValue based on our random stuffs.
		let difficulty =
			this.calculateHeightDifficulty(size.height) *
			this.calculateFailureDifficulty(failureType, failureValue) *
			this.calculateColorDifficulty(colorCount);
		//TODO: Randomness

		let victoryValue = Math.round(difficulty * 0.2) * 10;
		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.Matches, failureValue, victoryValue);
	}

	private generateLevelMatchXOfColor(levelNumber: number, gen: RandomGenerator): LevelDef {
		let size = this.randomSize(gen);
		let colorCount = this.randomColorCount(gen);
		let amount = 50 + this.playerCount * gen.intInclusive(5, 10); //50 + players * (5 - 10)
		//^^ Could consider the grid size for calculating the amount

		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, FailureType.MatchXOfColor, VictoryType.MatchXOfColor, { color: 5, amount: amount }, { color: 3, amount: amount });
	}

	private generateLevelRequireMatch(levelNumber: number, failureType: FailureType, gen: RandomGenerator): LevelDef {
		let size = this.randomSize(gen);
		let colorCount = this.randomColorCount(gen);
		let failureValue = this.randomFailureValue(failureType, gen);

		//Now calculate the victoryValue based on our random stuffs.
		let difficulty =
			this.calculateFailureDifficulty(failureType, failureValue) *
			this.calculateColorDifficulty(colorCount);
		//TODO: Randomness
		
		var amount = Math.round(difficulty * 0.15);

		let victoryValue = new Array<{ x: number, y: number, amount: number }>();
		for (var i = 0; i < amount; i++) {
			let x = gen.intExclusive(1, size.width - 1);
			let y = gen.intExclusive(1, size.height - 1);

			victoryValue.push({ x, y, amount: 1 });
		}

		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.RequireMatch, failureValue, victoryValue);
	}

	private generateLevelScore(levelNumber: number, failureType: FailureType, gen: RandomGenerator): LevelDef {
		let size = this.randomSize(gen);
		let colorCount = this.randomColorCount(gen);
		let failureValue = this.randomFailureValue(failureType, gen);

		//Now calculate the victoryValue based on our random stuffs.
		let difficulty =
			this.calculateHeightDifficulty(size.height) *
			this.calculateFailureDifficulty(failureType, failureValue) *
			this.calculateColorDifficulty(colorCount);
		//TODO: Randomness

		let victoryValue = difficulty * 250;

		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.Score, failureValue, victoryValue);
	}


	private randomSize(gen: RandomGenerator): { width: number, height: number } {
		
		let minWidth = Math.min(40, 10 + this.playerCount * 2);
		let maxWidth = Math.min(250, 10 + this.playerCount * 10);
		
		let minHeight = Math.min(40, 10 + this.playerCount * 2);
		let maxHeight = Math.min(80, 10 + this.playerCount * 4)
		
		return { width: gen.intExclusive(minWidth, maxWidth), height: gen.intExclusive(minHeight, maxHeight) };
	}

	private randomColorCount(gen: RandomGenerator, defaultCount?: number): number {
		//Normally we want (??)
		//but could have +/-2 (max 11)
		defaultCount = defaultCount || defaultColorCount;

		let rnd = gen.intExclusive(0, 10);
		switch (rnd) {
			case 0:
				return defaultCount - 2;
			case 1:
				return defaultCount - 1;
			case 3:
				return defaultCount + 1;
			default:
				return defaultCount;
		}
	}

	private randomFailureValue(failureType: FailureType, gen: RandomGenerator): any {
		switch (failureType) {
			case FailureType.Swaps:
				return 20 + this.playerCount * gen.intInclusive(10, 30); //20 + players * (10 - 30) swaps
			case FailureType.Time:
				return 60 + 30 * gen.intInclusive(0, 4); // 1-3 minutes
		}
		throw new Error("Cannot generate randomFailureValue for " + failureType + " " + FailureType[failureType]);
	}

	private calculateFailureDifficulty(failureType: FailureType, failureValue: any): number {
		switch (failureType) {
			case FailureType.Swaps:
				return <number>failureValue;
			case FailureType.Time:
				return <number>failureValue * (this.playerCount / 3);
		}
		throw new Error("Cannot calculate failure difficulty for " + failureType + " " + FailureType[failureType]);
	}

	private calculateHeightDifficulty(height: number): number {
		return 1 + (height - 10) / 10;
	}

	/** Returns > 1 for easier, < 1 for harder */
	private calculateColorDifficulty(colorCount: number, defaultCount?: number): number {
		defaultCount = defaultCount || defaultColorCount;

		if (colorCount == defaultCount + 1) {
			return 0.75;
		}
		if (colorCount == defaultCount) {
			return 1;
		}
		if (colorCount == defaultCount - 1) {
			return 1.5;
		}
		if (colorCount == defaultCount - 2) {
			return 2;
		}
		throw new Error("ColorDifficult out of range " + colorCount + ", " + defaultCount);
	}
}

export = LevelDefFactoryDynamic1;