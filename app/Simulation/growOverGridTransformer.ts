import Color = require('./color');
import Grid = require('./grid');
import MagicNumbers = require('./magicNumbers');
import Match = require('./match');
import MatchType = require('./matchType');
import MatchPerformer = require('./matchPerformer');
import Type = require('./type');

class GrowOverGridTransformer {
	private neighbours = [
		{ x: 1, y: 0},
		{ x: -1, y: 0},
		{ x: 0, y: MagicNumbers.matchableYScale},
		{ x: 0, y: -MagicNumbers.matchableYScale},
	];

	constructor(matchPerformer: MatchPerformer, private grid: Grid) {
		matchPerformer.matchPerformed.on((match) => this.matchPerformed(match))
	}

	private matchPerformed(match: Match) {
		if (match.matchType != MatchType.NormalCross && match.matchType != MatchType.NormalHorizontal && match.matchType != MatchType.NormalVertical) {
			return;
		}
		let shouldGrow = false;

		for (let i = 0; i < match.matchables.length && !shouldGrow; i++) {
			let m = match.matchables[i];

			//Get neighbours
			for (let j = 0; j < this.neighbours.length; j++) {
				let n = this.neighbours[j];
				let neighbour = this.grid.findMatchableAtPosition(m.x + n.x, m.y + n.y);
				if (neighbour && neighbour.type == Type.GrowOverGrid) {
					shouldGrow = true;
					break;
				}
			}
		}

		if (shouldGrow) {
			match.matchables.forEach(m => {
				m.transformTo = Type.GrowOverGrid;
				m.transformToColor = Color.None;
				//TODO? this.matchableTransforming.trigger(m);
			});
		}
	}
}

export = GrowOverGridTransformer;