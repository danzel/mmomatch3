class SpawnData { //TODO: client can probably generate id and y
	id: number;
	x: number;
	y: number;
	color: number;
	
	constructor(id: number, x: number, y: number, color: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.color = color;
	}
}

export = SpawnData;