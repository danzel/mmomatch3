import Player = require('./player');

class PlayerProvider {
	private players: { [id: number]: Player }
	private idCounter: number;
	
	constructor() {
		this.players = {};
		this.idCounter = 1;
	}
	
	createPlayer(commsId: string, name: string): Player {
		var player = new Player(this.idCounter, commsId, name);
		this.players[player.id] = player;
		
		this.idCounter++;
		
		return player;
	}
}

export = PlayerProvider;