class SimulationData {
	constructor(
		public matchableIdCounter: number,
		public framesElapsed: number,
		public tickRate: number,
		public totalMatchablesMatched: number,
		public pointsData: { [playerId: number]: number },
		public comboSize: { [playerId: number]: number },
		public comboOwners: Array<{ x: number, y: number, playerId: number }>) {
	}
}

export = SimulationData;