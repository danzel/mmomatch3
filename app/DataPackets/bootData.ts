import Simulation = require('../Simulation/simulation');

import GridData = require('./BootParts/gridData');
import SwapHandlerData = require('./BootParts/swapHandlerData');

class BootData {
	constructor(public matchableIdCounter: number, public width: number, public height: number, public grid: GridData, public swapHandler: SwapHandlerData) {
	}
}

export = BootData;