import GridData = require('./BootParts/gridData');
import LevelDefData = require('./BootParts/levelDefData');
import SimulationData = require('./BootParts/simulationData');
import SwapHandlerData = require('./BootParts/swapHandlerData');

class BootData {
	playerId: number;
	constructor(
		public level: LevelDefData,
		public grid: GridData,
		public swapHandler: SwapHandlerData,
		public simulationData: SimulationData) {
	}
}

export = BootData;