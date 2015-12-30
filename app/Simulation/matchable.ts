
var id = 0;

class Matchable {
	id: number;
	x: number;
	y: number;
	
	yMomentum: number;
	
	constructor(x: number, y: number){
		id++;
		this.id = id;
		
		this.x = x;
		this.y = y;
		
		this.yMomentum = 0;
	}
	
	get isMoving() : boolean {
		return this.yMomentum != 0;
	}
}

export = Matchable;