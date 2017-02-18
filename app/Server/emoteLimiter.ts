/** Players can do an emote once per move */
class EmoteLimiter {
	private lookup: { [playerId: number]: boolean } = {};

	reset(playerId: number): void {
		this.lookup[playerId] = true;
	}

	limitCheck(playerId: number): boolean {
		let result = this.lookup[playerId];
		if (result) {
			this.lookup[playerId] = false;
		}

		return result;
	}
}

export = EmoteLimiter;