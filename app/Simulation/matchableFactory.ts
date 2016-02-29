import Matchable = require('./matchable');
import Color = require('./color');
import Type = require('./type');

class MatchableFactory {
	private nextId: number;

	constructor(initialId: number = 1) {
		this.nextId = initialId;
	}

	create(x: number, y: number, color: Color): Matchable {
		var m = new Matchable(this.nextId, x, y, color, Type.Normal);

		this.nextId++;

		return m;
	}
	
	get idForSerializing() {
		return this.nextId;
	}
}

export = MatchableFactory;