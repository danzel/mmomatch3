import Color = require('./color');
import ComboOwnership = require('./Scoring/comboOwnership');
import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import MagicNumbers = require('./magicNumbers');
import OwnedMatch = require('./Scoring/ownedMatch');
import MatchType = require('./matchType');
import MatchPerformer = require('./matchPerformer');
import Type = require('./type');

class GrowOverGridTransformer {
	private neighbours = [
		{ x: 1, y: 0 },
		{ x: -1, y: 0 },
		{ x: 0, y: MagicNumbers.matchableYScale },
		{ x: 0, y: -MagicNumbers.matchableYScale },
	];

	matchablesTransforming = new LiteEvent<OwnedMatch>();

	constructor(comboOwnership: ComboOwnership, private grid: Grid) {
		comboOwnership.ownedMatchPerformed.on((match) => this.matchPerformed(match))
	}

	private matchPerformed(match: OwnedMatch) {
		if (match.match.matchType != MatchType.NormalCross && match.match.matchType != MatchType.NormalHorizontal && match.match.matchType != MatchType.NormalVertical) {
			return;
		}
		let shouldGrow = false;

		for (let i = 0; i < match.match.matchables.length && !shouldGrow; i++) {
			let m = match.match.matchables[i];

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
			match.match.matchables.forEach(m => {
				m.transformTo = Type.GrowOverGrid;
				m.transformToColor = Color.None;
			});

			this.matchablesTransforming.trigger(match);
		}
	}
}

export = GrowOverGridTransformer;