import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');

interface ISpawnManager {
	matchableSpawned: LiteEvent<Matchable>;

	update(dt: number);
}

export = ISpawnManager;