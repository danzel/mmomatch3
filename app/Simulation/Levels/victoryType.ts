enum VictoryType {
	Matches,
	Score,

	/** Value is { color: Color, amount: number } */
	MatchXOfColor,

	/** LevelDef.VictoryValue is a [{x, y, amount}] */
	RequireMatch,

	/** LevelDef.VictoryValue is the column index to start the thing at the top of */
	GetThingToBottom,
	
	/** LevelDef.VictoryValue is an array of column indexes to start the thing at the top of */
	GetThingsToBottom,

	/** Not a real VictoryType, just for random gen */
	Count
}

export = VictoryType;