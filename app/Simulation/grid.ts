/// <reference path="../../typings/bit-array/bit-array.d.ts" />
import BitArray = require('bit-array');

import MagicNumbers = require('./magicNumbers');
import Matchable = require('./matchable');

interface XY {
	x: number;
	y: number;
}

class Grid {
	private maxInColumn: Array<number>;

	width: number
	height: number
	cells: Array<Array<Matchable>>
	private holes: BitArray;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.cells = new Array<Array<Matchable>>(width);
		this.holes = new BitArray(width * height);
		this.maxInColumn = new Array<number>(width);

		for (var x = 0; x < width; x++) {
			this.cells[x] = new Array<Matchable>(0);
			this.maxInColumn[x] = height;
		}
	}

	findMatchableById(id: number): Matchable {
		for (let x = 0; x < this.width; x++) {
			let col = this.cells[x];
			for (let y = 0; y < col.length; y++) {
				if (col[y].id == id) {
					return col[y];
				}
			}
		}

		return null;
	}

	findMatchableAtPosition(positionX: number, positionY: number) {
		if (positionX >= 0 && positionX < this.width) {
			let col = this.cells[positionX];
			for (let i = Math.min(Math.ceil(positionY / MagicNumbers.matchableYScale), col.length - 1); i >= 0 && col[i].y >= positionY; i--) {
				if (col[i].y == positionY) {
					return col[i];
				}
			}
		}
	}

	swap(left: Matchable, right: Matchable): void {
		let leftCol = this.cells[left.x];
		let rightCol = this.cells[right.x];

		let leftY = leftCol.indexOf(left);
		let rightY = rightCol.indexOf(right);

		let tempX = left.x;
		let tempY = left.y;

		left.x = right.x;
		left.y = right.y;

		right.x = tempX;
		right.y = tempY;

		rightCol[rightY] = left;
		leftCol[leftY] = right;
	}

	private indexFromXY(x: number, y: number): number {
		return x * this.height + y;
	}

	setHole(x: number, y: number): void {
		this.maxInColumn[x]--;
		this.holes.set(this.indexFromXY(x, y), true);
	}

	isHole(x: number, y: number): boolean {
		y /= MagicNumbers.matchableYScale;
		if (y >= this.height) {
			console.warn("y >= this.height", y, this.height);
			return false;
		}
		return this.holes.get(this.indexFromXY(x, y));
	}

	maxMatchablesInColumn(x: number): number {
		return this.maxInColumn[x];
	}
}

export = Grid;