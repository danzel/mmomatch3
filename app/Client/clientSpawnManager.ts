import Grid = require('../Simulation/grid');
import SpawnManager = require('../Simulation/spawnManager');
import Matchable = require('../Simulation/matchable');
import SpawnData = require('../DataPackets/spawnData');

class ClientSpawnManager extends SpawnManager {
	private spawns: Array<SpawnData>;
	
	notifySpawns(spawns: Array<SpawnData>) {
		this.spawns = spawns;
	}

	update(dt: number) {
		if (!this.spawns)
			return;
			
		for (let i = 0; i < this.spawns.length; i++) {
			var spawn = this.spawns[i];
			
			let y = this.findYForColumn(this.grid.cells[spawn.x]);
			let matchable = this.matchableFactory.create(spawn.x, y, spawn.color);

			this.grid.cells[spawn.x].push(matchable);
			this.matchableSpawned.trigger(matchable);
		}
		
		this.spawns = null;
	}
}

export = ClientSpawnManager;