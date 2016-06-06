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
			
			let x = spawn[SpawnData.index_x];
			let y = this.findYForColumn(this.grid.cells[x]);
			let matchable = this.matchableFactory.create(x, y, spawn[SpawnData.index_color], spawn[SpawnData.index_type]);

			this.grid.cells[x].push(matchable);
			this.matchableSpawned.trigger(matchable);
		}
		
		this.spawns = null;
	}
}

export = ClientSpawnManager;