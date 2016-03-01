import Color = require('./color');
import LiteEvent = require('../liteEvent');
import Match = require('./match');
import Matchable = require('./matchable');
import MatchType = require('./matchType');
import MatchPerformer = require('./matchPerformer');
import Type = require('./type');

/**
 * Match 4 vertically -> Horizontal clearer
 * Match 4 horizontally -> Vertical clearer
 * Match 5 either -> Color clearer
 */
class MatchableTransformer {
	private matchTypesThatCauseReplacements = [ /*MatchType.NormalCross, */ MatchType.NormalHorizontal, MatchType.NormalVertical];

	matchableTransforming = new LiteEvent<Matchable>();

	constructor(matchPerformer: MatchPerformer) {
		matchPerformer.matchPerformed.on(match => this.matchPerformed(match));
	}

	private matchPerformed(match: Match) {
		if (this.matchTypesThatCauseReplacements.indexOf(match.matchType) == -1) {
			return;
		}
		if (match.matchables.length != 4 && match.matchables.length != 5) {
			return;
		}
		
		//TODO
		//Find the most center(?) one that isn't already special
		//Or should we just look at the one that was swapped in? Not sure....
		let matchables = match.matchables;
		let minX = matchables[0].x;
		let minY = matchables[0].y;
		let maxX = matchables[0].x;
		let maxY = matchables[0].y;

		for (let i = 1; i < matchables.length; i++) {
			let m = matchables[i];
			minX = Math.min(minX, m.x);
			minY = Math.min(minY, m.y);

			maxX = Math.max(maxX, m.x);
			maxY = Math.max(maxY, m.y);
		}

		let midX = (minX + maxX) / 2;
		let midY = (minY + maxY) / 2;
		
		//When there are 4 this is a bit arbitrary
		//When there is a L or a X we should always get the one in the corner
		//When there is 5 we should always get the one in the middle?
		
		let closest: Matchable;
		let closestDist: number = 9999;

		for (let i = 0; i < matchables.length; i++) {
			let m = matchables[i];

			if (m.type != Type.Normal) {
				continue;
			}

			let dist = (midX - m.x) * (midX - m.x) + (midY - m.y) * (midY - m.y);

			if (dist < closestDist) {
				closest = m;
				closestDist = dist;
			}
		}

		if (match.matchables.length == 5) {
			closest.transformToColor = Color.None;
			closest.transformTo = Type.ColorClearWhenSwapped;
		} else {
			closest.transformToColor = closest.color;
			switch (match.matchType) {
				case MatchType.NormalVertical:
					closest.transformTo = Type.HorizontalClearWhenMatched;
					break;
				case MatchType.NormalHorizontal:
					closest.transformTo = Type.VerticalClearWhenMatched;
					break;
				default:
					throw new Error("Don't know what to replace with for this match type");
			}
		}
		this.matchableTransforming.trigger(closest);
	}
}

export = MatchableTransformer;