enum VictoryType {

	/** LevelDef.VictoryValue is a [{x, y, amount}] */
	RequireMatch,

	/** Value is { color: Color, amount: number } */
	MatchXOfColor,

	Score,

	/** LevelDef.VictoryValue is an array of column indexes to start the thing at the top of */
	GetThingsToBottom,

	Matches,

	/** Not a real VictoryType, just for random gen. Anything below here is out of the level rotation */
	Count, 
}

export = VictoryType;