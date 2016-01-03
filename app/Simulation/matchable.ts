import Color = require('./color');

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

	constructor(id: number, x: number, y: number, color: Color) {
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