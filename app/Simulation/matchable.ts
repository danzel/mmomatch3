import Color = require('./color');
import Type = require('./type');

class Matchable {
	public static TicksToDisappear = 24;
	
	isDisappearing = false;
	disappearingTicks = 0;
	transformToColor: Color;
	transformTo: Type;

	yMomentum = 0;

	beingSwapped = false;

	constructor(public id: number, public x: number, public y: number, public color: Color, public type: Type) {
		if (isNaN(color)) {
			throw new Error("color is NaN");
		}
		if (isNaN(type)) {
			throw new Error("type is NaN");
		}
	}
	
	get isMoving(): boolean {
		return this.yMomentum != 0;
	}
	
	get disappearingPercent() : number {
		return this.disappearingTicks / Matchable.TicksToDisappear;
	}
}

export = Matchable;