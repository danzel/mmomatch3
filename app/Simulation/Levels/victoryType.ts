enum VictoryType {
	Matches,
	Score,
	
	/** LevelDef.VictoryValue is a [{x, y, amount}] */
	RequireMatch,
	
	/** LevelDef.VictoryValue is the column index to start the thing at the top of */
	GetThingToBottom
}

export = VictoryType;