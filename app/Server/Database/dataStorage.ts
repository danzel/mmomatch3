import GameEndType = require('../../Simulation/Levels/gameEndType');
import LevelDef = require('../../Simulation/Levels/levelDef');
import Player = require('../../Simulation/Scoring/player');
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');

import LevelModel = require('./Models/levelModel');
import LevelPlayerModel = require('./Models/levelPlayerModel');
import PlayerModel = require('./Models/playerModel');

interface DataStorage {
	ensurePlayerExists(authProvider: string, authId: string, name: string, done: (playerId: number) => void): void;
	recordLevelResult(level: LevelDef, gameEndType: GameEndType, players: Array<Player>, scoreTracker: ScoreTracker, done?: () => void): void;

	getPlayer(playerDbId: number, done: (player: PlayerModel) => void): void;
	getLatestLevelResults(playerDbId: number, count: number, done: (levels: Array<LevelModel & LevelPlayerModel>) => void): void;
};

export = DataStorage;