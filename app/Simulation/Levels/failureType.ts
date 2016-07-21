enum FailureType {
	Time = 1,
	Swaps = 2,
	
	/** Value is { color: Color, amount: number } */
	MatchXOfColor = 3,
	/** Type that we want (Type.GetToBottomRace1/2) */
	GetToBottomRace = 4
}

export = FailureType;