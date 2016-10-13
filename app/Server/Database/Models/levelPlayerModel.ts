/** Links a level with a player that was playing it */
interface LevelPlayerModel {
	levelNumber: number;
	playerId: number;

	rank: number;
	score: number;

	/** Team levels where team is decided by playerId which swaps the win/lose result */
	playerWasOnOppositeTeam: boolean;
};

export = LevelPlayerModel;