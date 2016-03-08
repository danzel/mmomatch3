import SwapData = require('./swapData');

class SwapHandlerData {
	constructor(
		public swaps: Array<SwapData>,
		public totalSwapsCount: number) {
		
	}
}

export = SwapHandlerData;