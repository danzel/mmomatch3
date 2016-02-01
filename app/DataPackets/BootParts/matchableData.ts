class MatchableData {
	constructor(
		public id: number,
		public x: number,
		public y: number,
		public color: number,
		public isDisappearing: boolean,
		public disappearingTime: number,
		public yMomentum: number,
		public beingSwapped: boolean) {
	}
}

export = MatchableData;