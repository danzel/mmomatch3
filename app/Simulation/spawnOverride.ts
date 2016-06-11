import Color = require('./color');
import MagicNumbers = require('./magicNumbers');
import Matchable = require('./matchable');
import MatchableFactory = require('./matchableFactory');
import Type = require('./type');

/** Only applies during the initial spawn */
class SpawnOverride {
	spawns: { [xy: number]: { color: Color, type: Type } } = {};

	constructor(private matchableFactory: MatchableFactory) {
	}

	addSpawn(x: number, y: number, color: Color, type: Type) {
		let xy = this.calculateXY(x, y);

		if (this.spawns[xy]) {
			throw new Error(x + "," + y + " has already been added");
		}

		this.spawns[xy] = { color, type };
	}

	//Limited to 65535x65535 size probably
	private calculateXY(x: number, y: number) {
		return ((x | 0) << 16) | ((y / MagicNumbers.matchableYScale) | 0);
	}

	spawnMaybe(x: number, y: number): Matchable {
		let xy = this.calculateXY(x, y);
		let force = this.spawns[xy];

		if (!force) {
			return;
		}

		this.spawns[xy] = null;
		return this.matchableFactory.create(x, y, force.color, force.type);
	}
}

export = SpawnOverride;