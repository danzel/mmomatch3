class SimulationData {
	constructor(public matchableIdCounter: number, public framesElapsed: number, public pointsData: { [playerId: number]: number }) {
		
	}
}

export = SimulationData;