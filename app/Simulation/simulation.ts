import Grid = require('./grid');
import SpawnManager = require('./spawnManager');

class Simulation {
	grid: Grid
	spawnManager: SpawnManager
	
	constructor() {
		this.grid = new Grid(50, 20);
		this.spawnManager = new SpawnManager(this.grid);
	}
	
	update(dt: number){
		//TODO: Physics
		
		this.spawnManager.update(dt);
	}
}

export = Simulation;