import Grid = require('../Simulation/grid');
import ISpawnManager = require('../Simulation/iSpawnManager');
import LiteEvent = require('../liteEvent');
import Matchable = require('../Simulation/matchable');
import SpawnData = require('../DataPackets/spawnData');

class ClientSpawnManager implements ISpawnManager {
	private grid: Grid;
	private spawns: Array<SpawnData>;
	
	matchableSpawned = new LiteEvent<Matchable>();

	constructor(grid: Grid) {
		this.grid = grid;
	}
	
	notifySpawns(spawns: Array<SpawnData>) {
		this.spawns = spawns;
	}

	update(dt: number) {
		if (!this.spawns)
			return;
			
		for (let i = 0; i < this.spawns.length; i++) {
			var spawn = this.spawns[i];
			
			let matchable = new Matchable(spawn.x, spawn.y, spawn.color);
			matchable.id = spawn.id;

			this.grid.cells[spawn.x].push(matchable);
			this.matchableSpawned.trigger(matchable);
		}
		
		this.spawns = null;
	}
}

export = ClientSpawnManager;