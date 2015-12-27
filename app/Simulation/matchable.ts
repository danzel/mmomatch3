
var id = 0;

class Matchable {
	id: number
	x: number
	y: number
	
	constructor(x: number, y: number){
		id++;
		this.id = id;
		
		this.x = x;
		this.y = y;
	}
}

export = Matchable;