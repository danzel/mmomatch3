import DataStorage = require('../../app/Server/Database/dataStorage');
import GameEndType = require('../../app/Simulation/Levels/gameEndType');
import LevelDef = require('../../app/Simulation/Levels/levelDef');
import LevelModel = require('../../app/Server/Database/Models/levelModel');
import LevelPlayerModel = require('../../app/Server/Database/Models/levelPlayerModel');
import Player = require('../../app/Simulation/Scoring/player');
import PlayerModel = require('../../app/Server/Database/Models/playerModel');
import ScoreTracker = require('../../app/Simulation/Scoring/scoreTracker');

class MockStorage implements DataStorage {
	ensurePlayerExists(authProvider: string, authId: string, name: string, done: (playerId: number) => void): void {
		done(1);
	}
	recordLevelResult(level: LevelDef, gameEndType: GameEndType, players: Array<Player>, scoreTracker: ScoreTracker, done?: () => void): void {
		if (done) {
			done();
		}
	}

	getPlayer(playerDbId: number, done: (player: PlayerModel) => void): void {
		done(null);
	}
	getLatestLevelResults(playerDbId: number, count: number, done: (levels: Array<LevelModel & LevelPlayerModel>) => void): void {
		done([]);
	}
}

export = MockStorage;