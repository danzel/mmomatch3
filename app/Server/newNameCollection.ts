import Player = require('../Simulation/Scoring/player');

class NewNameCollection {
	newNames = new Array<Player>();

	notifyNewPlayer(player: Player): void {
		if (player.name) {
			this.newNames.push(player);
		}
	}

	clear() {
		this.newNames.length = 0;
	}
}

export = NewNameCollection;