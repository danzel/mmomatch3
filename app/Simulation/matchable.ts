import Color = require('./color');
import Type = require('./type');

class Matchable {
	public static TimeToDisappear = 0.4;
	
	isDisappearing = false;
	disappearingTime = 0;

	yMomentum = 0;

	beingSwapped = false;

	constructor(public id: number, public x: number, public y: number, public color: Color, public type: Type) {
	}
	
	get isMoving(): boolean {
		return this.yMomentum != 0;
	}
	
	get disappearingPercent() : number {
		return this.disappearingTime / Matchable.TimeToDisappear;
	}
}

export = Matchable;