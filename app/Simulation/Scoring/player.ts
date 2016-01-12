class Player {
	id: number;
	matchablesMatched: number;
	
	constructor(id: number) {
		this.id = id;
		this.matchablesMatched = 0;
	}
}

export = Player;