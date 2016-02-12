import Simulation = require('../Simulation/simulation');

import GridData = require('./BootParts/gridData');
import LevelDefData = require('./BootParts/levelDefData');
import SwapHandlerData = require('./BootParts/swapHandlerData');

class BootData {
	playerId: number;
	constructor(public level: LevelDefData, public matchableIdCounter: number, public grid: GridData, public swapHandler: SwapHandlerData) {
	}
}

export = BootData;