enum FailureType {
	Time,
	Swaps,
	
	/** Value is { color: Color, amount: number } */
	MatchXOfColor,
	/** Type that we want (Type.GetToBottomRace1/2) */
	GetToBottomRace
}

export = FailureType;