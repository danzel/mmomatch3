import LevelDef = require('./levelDef');
import Player = require('../Scoring/player');
import VictoryType = require('./victoryType');

class TeamLogic {
	static levelTypeIsTeamBased(level: LevelDef): boolean {
		if (level.victoryType == VictoryType.MatchXOfColor) {
			return true;
		}
		if (level.victoryType == VictoryType.GetToBottomRace) {
			return true;
		}
		return false;
	}

	static playerIsOnOppositeTeam(playerId: number) {
		return (playerId % 2 == 1);
	}
};

export = TeamLogic;