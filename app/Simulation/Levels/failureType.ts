enum FailureType {
	Time,
	Swaps,
	
	/** Value is { color: Color, amount: number } */
	MatchXOfColor,
	
	/** Not a real FailureType, just for random gen */
	Count
}

export = FailureType;