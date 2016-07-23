class Player {
	matchablesMatched: number;
	databaseId: number;
	
	constructor(public id: number, public commsId: string, public name: string) {
		this.matchablesMatched = 0;
	}
}

export = Player;