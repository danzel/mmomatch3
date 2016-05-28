class MoveRateLimiter {
	lastMoves: {[id: number]: Array<number>} = {};
	
	constructor(private movesPerSecond: number) {
		
	}
	
	limitCheck(playerId: number, timeSeconds: number): boolean {
		if (!this.lastMoves[playerId]) {
			this.lastMoves[playerId] = [];
		}
		let last = this.lastMoves[playerId];
		if (last.length == this.movesPerSecond && last[0] >= timeSeconds - 1) {
			return false;
		}
		last.push(timeSeconds);
		if (last.length > this.movesPerSecond) {
			last.splice(0, 1);
		}
		
		return true;
	} 
}

export = MoveRateLimiter;