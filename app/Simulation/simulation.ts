import Grid = require('./grid');
import SpawnManager = require('./spawnManager');
import Physics = require('./physics');

class Simulation {
	grid: Grid
	spawnManager: SpawnManager
	physics: Physics

	constructor() {
		this.grid = new Grid(50, 20);
		this.spawnManager = new SpawnManager(this.grid);
		this.physics = new Physics(this.grid);
	}

	update(dt: number) {
		this.physics.update(dt);
		this.spawnManager.update(dt);
	}
	
	swap(x: number, y: number, xTarget: number, yTarget: number) {
		console.log('todo swap sim');
		//TODO
	}
}

export = Simulation;