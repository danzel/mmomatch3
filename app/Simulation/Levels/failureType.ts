enum FailureType {
	Time,
	Swaps,
	
	/** Not a real FailureType, just for random gen */
	Count,
	
	//The following should never be randomly generated
	
	/** Value is { color: Color, amount: number } */
	MatchXOfColor
}

export = FailureType;