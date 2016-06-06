class SpawnData extends Array<number> {
	static create(x: number, color: number, type: number) {
		return [x, color, type];
	}
	
	static index_x = 0;
	static index_color = 1;
	static index_type = 2;
}

export = SpawnData;