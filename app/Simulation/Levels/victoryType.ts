enum VictoryType {

	/** LevelDef.VictoryValue is a [{x, y, amount}] */
	RequireMatch,

	/** Value is { color: Color, amount: number } */
	MatchXOfColor,

	Score,

	/** LevelDef.VictoryValue is an array of column indexes to start the thing at the top of */
	GetThingsToBottom,

	/** Type that we want (Type.GetToBottomRace1/2) */
	GetToBottomRace,

	Matches,
}

export = VictoryType;