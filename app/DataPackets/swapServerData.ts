class SwapServerData {
	playerId: number;
	leftId: number;
	rightId: number;
	
	constructor(playerId: number, leftId: number, rightId: number) {
		this.playerId = playerId;
		this.leftId = leftId;
		this.rightId = rightId;
	}
}

export = SwapServerData;