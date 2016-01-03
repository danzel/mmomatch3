import SpawnData = require('./spawnData');
import SwapData = require('./swapData');

class FrameData {
	spawnData: Array<SpawnData>;
	swapData: Array<SwapData>;
	
	constructor() {
		this.spawnData = [];
		this.swapData = [];
	}
}

export = FrameData;