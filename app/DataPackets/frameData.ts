import SpawnData = require('./spawnData');
import SwapServerData = require('./swapServerData');

class FrameData {
	spawnData: Array<SpawnData>;
	swapData: Array<SwapServerData>;
	
	constructor() {
		this.spawnData = [];
		this.swapData = [];
	}
}

export = FrameData;