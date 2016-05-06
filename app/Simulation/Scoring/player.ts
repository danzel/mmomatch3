class Player {
	matchablesMatched: number;
	
	constructor(public id: number, public commsId: string, public name: string) {
		this.matchablesMatched = 0;
	}
}

export = Player;