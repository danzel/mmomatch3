import SpawnData = require('./spawnData');
import SwapData = require('./swapData');

class TickData {
	framesElapsed: number;
	swaps: Array<SwapData>;
	spawns: Array<SpawnData>;
		
	constructor(framesElapsed: number, swaps: Array<SwapData>, spawns: Array<SpawnData>) {
		this.framesElapsed = framesElapsed;
		this.swaps = swaps;
		this.spawns = spawns;
	}
}

export = TickData;