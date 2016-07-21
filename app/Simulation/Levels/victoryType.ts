enum VictoryType {

	/** LevelDef.VictoryValue is a [{x, y, amount}] */
	RequireMatch = 1,

	/** Value is { color: Color, amount: number } */
	MatchXOfColor = 2,

	Score = 3,

	/** LevelDef.VictoryValue is an array of column indexes to start the thing at the top of */
	GetThingsToBottom = 4,

	/** Type that we want (Type.GetToBottomRace1/2) */
	GetToBottomRace = 5,

	/** Percentage of grid required to grow over */
	GrowOverGrid = 6,

	Matches = 7,
}

export = VictoryType;