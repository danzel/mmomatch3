import FailureType = require('./failureType');
import LevelDef = require('./levelDef');
import LevelDefFactoryDynamic = require('./levelDefFactoryDynamic');
import RandomGenerator = require('../randomGenerator');
import Type = require('../type');
import VictoryType = require('./victoryType');

const defaultColorCount = 7;

//iPhone 5 can fit 32,56 (portrait,landscape)
const maxAllowedWidth = 80;

class LevelDefFactoryDynamic1 extends LevelDefFactoryDynamic {
	playerCount = 10;

	victoryTypes: Array<VictoryType>;
	failureTypes: { [victoryType: number]: Array<FailureType> } = {};

	constructor() {
		super();

		this.victoryTypes = [
			VictoryType.GetThingsToBottom,
			VictoryType.Matches,
			VictoryType.GrowOverGrid,
			VictoryType.GetToBottomRace,
			VictoryType.RequireMatch,
			VictoryType.Score,
			VictoryType.MatchXOfColor, // Pigs vs Pugs
		];

		this.failureTypes[VictoryType.GetThingsToBottom] = [FailureType.Swaps, FailureType.Time];
		this.failureTypes[VictoryType.GetToBottomRace] = [FailureType.GetToBottomRace];
		this.failureTypes[VictoryType.GrowOverGrid] = [FailureType.Swaps, FailureType.Time];
		this.failureTypes[VictoryType.Matches] = [FailureType.Time];
		this.failureTypes[VictoryType.MatchXOfColor] = [FailureType.MatchXOfColor];
		this.failureTypes[VictoryType.RequireMatch] = [FailureType.Swaps, FailureType.Time];
		this.failureTypes[VictoryType.Score] = [FailureType.Swaps, FailureType.Time];
	}

	private debugPrintLevel(level: LevelDef) {
		console.log(level.levelNumber, level.width + 'x' + level.height, level.colorCount);
		console.log(VictoryType[level.victoryType], (level.victoryValue.length || level.victoryValue), FailureType[level.failureType], level.failureValue);
	}

	getLevel(levelNumber: number): LevelDef {
		let level = this.generateLevel(levelNumber);
		//this.debugPrintLevel(level);
		return level;
	}

	private generateLevel(levelNumber: number): LevelDef {
		let gen = new RandomGenerator(levelNumber);

		let victoryType = <VictoryType>(this.victoryTypes[levelNumber % this.victoryTypes.length]);
		let failureType = this.failureTypes[victoryType][gen.intExclusive(0, this.failureTypes[victoryType].length)];

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
			case VictoryType.GetToBottomRace:
				return this.generateLevelGetToBottomRace(levelNumber, gen);
			case VictoryType.GrowOverGrid:
				return this.generateLevelGrowOverGrid(levelNumber, failureType, gen);
			case VictoryType.Matches:
				return this.generateLevelMatches(levelNumber, failureType, gen);
			case VictoryType.MatchXOfColor:
				return this.generateLevelMatchXOfColor(levelNumber, gen);
			case VictoryType.RequireMatch:
				return this.generateLevelRequireMatch(levelNumber, failureType, gen);
			case VictoryType.Score:
				return this.generateLevelScore(levelNumber, failureType, gen);
			default:
				throw new Error("Cannot generate level for type " + victoryType + " " + VictoryType[<VictoryType>victoryType]);
		}
	}

	private generateLevelGetThingsToBottom(levelNumber: number, failureType: FailureType, gen: RandomGenerator): LevelDef {
		let amount = Math.floor(2 + (this.playerCount / 2));
		//Clamp between 2 and (this.playerCount, maxWidth / 5)
		amount = Math.min(this.playerCount, amount = Math.max(2, amount), Math.floor(maxAllowedWidth / 6));

		let size = { width: Math.min(maxAllowedWidth, amount * gen.intInclusive(5, 8)), height: gen.intInclusive(30, 50) };
		let colorCount = this.randomColorCount(gen);

		//Calculate failure value
		let difficulty = this.calculateColorDifficulty(colorCount);

		//TODO: Randomness
		let failureValue: number;
		switch (failureType) {
			case FailureType.Swaps:
				failureValue = Math.round(size.height * amount / difficulty * 1.25 / 10) * 10;
				break;
			case FailureType.Time:
				failureValue = Math.round(size.height * amount * 12 / difficulty / this.playerCount / 10) * 10;
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

	private generateLevelGetToBottomRace(levelNumber: number, gen: RandomGenerator) {
		let size = {
			width: gen.intExclusive(22, 30),
			height: gen.intExclusive(30, 60)
		};
		let colorCount = this.randomColorCount(gen);

		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, FailureType.GetToBottomRace, VictoryType.GetToBottomRace, Type.GetToBottomRace1, Type.GetToBottomRace2);
	}

	private generateLevelGrowOverGrid(levelNumber: number, failureType: FailureType, gen: RandomGenerator): LevelDef {
		let size = this.randomSizeSmallerSquare(gen);
		let colorCount = this.randomColorCount(gen);
		let failureValue = this.randomFailureValue(failureType, gen);

		//Now calculate the victoryValue based on our random stuffs.
		let difficulty =
			this.calculateFailureDifficulty(failureType, failureValue) *
			this.calculateColorDifficulty(colorCount);
		//TODO: Randomness

		let victoryValue = Math.round(difficulty * 0.07) * 10;
		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.GrowOverGrid, failureValue, victoryValue);
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

		let victoryValue = Math.round(difficulty * 0.25) * 10;
		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.Matches, failureValue, victoryValue);
	}

	private generateLevelMatchXOfColor(levelNumber: number, gen: RandomGenerator): LevelDef {
		let size = this.randomSize(gen);
		let colorCount = this.randomColorCount(gen, defaultColorCount + 1);
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

		let victoryValue = Math.round(difficulty * 150);

		return new LevelDef(levelNumber, size.width, size.height, [], colorCount, failureType, VictoryType.Score, failureValue, victoryValue);
	}


	private randomSize(gen: RandomGenerator): { width: number, height: number } {

		let minWidth = Math.min(30, 10 + this.playerCount * 2);
		let maxWidth = Math.min(maxAllowedWidth, 10 + this.playerCount * 10);

		let minHeight = Math.min(30, 10 + this.playerCount * 2);
		let maxHeight = Math.min(50, 10 + this.playerCount * 4)

		return { width: gen.intExclusive(minWidth, maxWidth), height: gen.intExclusive(minHeight, maxHeight) };
	}


	private randomSizeSmallerSquare(gen: RandomGenerator): { width: number, height: number } {

		let minSize = Math.min(40, 10 + this.playerCount * 2);
		let maxSize = Math.min(60, 10 + this.playerCount * 10, maxAllowedWidth);
		let size = gen.intExclusive(minSize, maxSize);

		return { width: size, height: size };
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
				return <number>failureValue * (this.playerCount / 5.5);
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
			return 1.25;
		}
		if (colorCount == defaultCount - 2) {
			return 1.5;
		}
		throw new Error("ColorDifficult out of range " + colorCount + ", " + defaultCount);
	}
}

export = LevelDefFactoryDynamic1;