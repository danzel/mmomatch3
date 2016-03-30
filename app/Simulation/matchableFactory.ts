import Matchable = require('./matchable');
import Color = require('./color');
import Type = require('./type');

class MatchableFactory {
	private nextId: number;

	forceSpawn: { x: number, y: number, color: Color, type: Type };

	constructor(initialId: number = 1) {
		this.nextId = initialId;
	}

	create(x: number, y: number, color: Color): Matchable {

		let type = Type.Normal;
		if (this.forceSpawn && this.forceSpawn.x == x && this.forceSpawn.y == y) {
			color = this.forceSpawn.color;
			type = this.forceSpawn.type;
			
			delete this.forceSpawn;
		}

		var m = new Matchable(this.nextId, x, y, color, type);

		this.nextId++;

		return m;
	}

	get idForSerializing() {
		return this.nextId;
	}
}

export = MatchableFactory;