class MatchableData extends Array<number> {
	static create(
		id: number,
		y: number,
		color: number,
		type: number,
		isDisappearing: boolean,
		disappearingTicks: number,
		yMomentum: number,
		transformTo: number,
		transformToColor: number
	): MatchableData {
		let d = [
			id,
			y,
			color,
			type
		]
		if (yMomentum || isDisappearing || transformTo || transformToColor) {
			d.push(yMomentum);
			if (isDisappearing || transformTo || transformToColor) {
				d.push(isDisappearing ? 1 : 0);
				d.push(disappearingTicks);
				
				if (transformTo || transformToColor) {
					d.push(transformTo);
					d.push(transformToColor);
				}
			}
		}
		return d;
	}

	static index_id = 0;
	static index_y = 1;
	static index_color = 2;
	static index_type = 3;
	
	static index_yMomentum = 4;
	
	static index_isDisappearing = 5;
	static index_disappearingTicks = 6;
	
	static index_transformTo = 7;
	static index_transformToColor = 8;

}

export = MatchableData;