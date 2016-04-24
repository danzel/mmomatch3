interface BotConfig {
	secondsBetweenMoves: number;

	/** How far away from our last move to look for a new move to do */
	moveRange: number;
}

export = BotConfig;