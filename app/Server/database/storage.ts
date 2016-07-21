import LevelDef = require('../../Simulation/Levels/levelDef');
import Player = require('../../Simulation/Scoring/player');
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');

interface LevelResult {
	level: LevelDef;
	victory: boolean;
	score: number; 
};

interface Storage {
	ensurePlayerExists(player: Player): void;
	recordLevelResult(level: LevelDef, victory: boolean, players: Array<Player>, scoreTracker: ScoreTracker): void;

	getPlayer(playerDbId: number): Player
	getLatestLevelResults(playerDbId: number, count: number): Array<LevelResult>;
}

export = Storage;