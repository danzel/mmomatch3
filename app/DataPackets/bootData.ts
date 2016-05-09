import GridData = require('./BootParts/gridData');
import LevelDefData = require('./BootParts/levelDefData');
import RequireMatchData = require('./BootParts/requireMatchData');
import SimulationData = require('./BootParts/simulationData');
import SwapHandlerData = require('./BootParts/swapHandlerData');

class BootData {
	constructor(
		public level: LevelDefData,
		public grid: GridData,
		public swapHandler: SwapHandlerData,
		public simulationData: SimulationData,
		public requireMatchData: RequireMatchData,
		public names: { [id: number]: string },
		public endAvailabilityDate: string) {
	}
}

export = BootData;