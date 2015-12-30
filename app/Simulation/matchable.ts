import Color = require('./color');

var id = 0;

class Matchable {
	id: number;
	x: number;
	y: number;
	color: Color;

	yMomentum: number;

	beingSwapped: boolean;

	constructor(x: number, y: number, color: Color) {
		id++;
		this.id = id;

		this.x = x;
		this.y = y;

		this.color = color;


		this.yMomentum = 0;
		this.beingSwapped = false;
	}

	get isMoving(): boolean {
		return this.yMomentum != 0;
	}
}

export = Matchable;