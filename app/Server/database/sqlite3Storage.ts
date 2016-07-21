import LevelDef = require('../../Simulation/Levels/levelDef');
import Player = require('../../Simulation/Scoring/player');
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');
import Storage = require('./Storage');

class Sqlite3Storage implements Storage {
	ensurePlayerExists(player: Player): void {

	}
	recordLevelResult(level: LevelDef, victory: boolean, players: Array<Player>, scoreTracker: ScoreTracker): void {
		
	}
};

export = Sqlite3Storage;