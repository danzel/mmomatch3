import SwapData = require('./swapData');

class TickData {
	framesElapsed: number;
	swaps: Array<SwapData>;
	
	constructor(framesElapsed: number, swaps: Array<SwapData>) {
		this.framesElapsed = framesElapsed;
		this.swaps = swaps;
	}
}

export = TickData;