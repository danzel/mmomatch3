import Color = require('./color');

var id = 0;

class Matchable {
	public static TimeToDisappear = 0.4;
	
	id: number;
	x: number;
	y: number;
	color: Color;

	isDisappearing: boolean;
	disappearingTime: number;

	yMomentum: number;

	beingSwapped: boolean;

	constructor(x: number, y: number, color: Color) {
		id++;
		this.id = id;

		this.x = x;
		this.y = y;
		this.color = color;

		this.isDisappearing = false;
		this.disappearingTime = 0;

		this.yMomentum = 0;
		this.beingSwapped = false;
	}
	
	get isMoving(): boolean {
		return this.yMomentum != 0;
	}
	
	get disappearingPercent() : number {
		return this.disappearingTime / Matchable.TimeToDisappear;
	}
}

export = Matchable;