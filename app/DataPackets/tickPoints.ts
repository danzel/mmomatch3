class TickPoints {
	playerId: number;
	name: string;
	points: number;
	
	constructor(playerId: number, name: string, points: number) {
		this.playerId = playerId;
		this.name = name;
		this.points = points;
	}
}

export = TickPoints;