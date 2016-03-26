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
	private match4Types = [ /*MatchType.NormalCross, */ MatchType.NormalHorizontal, MatchType.NormalVertical];
	private match5Types = [MatchType.NormalCross, MatchType.NormalHorizontal, MatchType.NormalVertical];

	matchableTransforming = new LiteEvent<Matchable>();

	constructor(matchPerformer: MatchPerformer) {
		matchPerformer.matchPerformed.on(match => this.matchPerformed(match));
	}

	private matchPerformed(match: Match) {
		if (this.match4Types.indexOf(match.matchType) != -1 && match.matchables.length == 4) {
			this.match4Performed(match);
			return;
		}
		if (this.match5Types.indexOf(match.matchType) != -1 && match.matchables.length >= 5) {
			if (this.tryMatch5(match)) {
				return;
			}
		}
		if (match.matchType == MatchType.NormalCross) {
			this.matchCrossPerformed(match);
			return;
		}
	}

	private match4Performed(match: Match) {
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
		this.matchableTransforming.trigger(closest);
	}

	private tryMatch5(match: Match): boolean {
		let m: Matchable;
		for (let i = 0; i < match.matchables.length - 4; i++) {
			m = match.matchables[i];

			let xMatchCount = this.count(match.matchables, mm => m.x == mm.x);
			if (xMatchCount >= 5) {
				let xMatches = match.matchables.filter(mm => mm.x == m.x);
				xMatches.sort((a, b) => a.y - b.y);
				this.match5(xMatches);

				return true;
			}

			let yMatchCount = this.count(match.matchables, mm => m.y == mm.y);
			if (yMatchCount >= 5) {
				let yMatches = match.matchables.filter(mm => mm.y == m.y);
				yMatches.sort((a, b) => a.x - b.x);
				this.match5(yMatches);

				return true;
			}
		}

		return false;
	}

	private match5(matches: Array<Matchable>) {
		let idx = Math.floor(matches.length / 2);
		let m = matches[idx];

		m.transformTo = Type.ColorClearWhenSwapped;
		m.transformToColor = Color.None;
		this.matchableTransforming.trigger(m);
	}

	private count(matchables: Array<Matchable>, truthTest: (matchable: Matchable) => boolean) {
		let res = 0;
		for (let i = 0; i < matchables.length; i++) {
			if (truthTest(matchables[i])) {
				res++;
			}
		}
		return res;
	}

	private matchCrossPerformed(match: Match) {

		let mostX: number;
		let mostXCount = -1;

		let mostY: number;
		let mostYCount = -1;

		let m: Matchable;
		for (let i = 0; i < match.matchables.length; i++) {
			m = match.matchables[i];

			let xCount = this.count(match.matchables, mm => m.x == mm.x);
			if (xCount > mostXCount) {
				mostX = m.x;
				mostXCount = xCount;
			}

			let yCount = this.count(match.matchables, mm => m.y == mm.y);
			if (yCount > mostYCount) {
				mostY = m.y;
				mostYCount = yCount;
			}
		}
		
		for (let i = 0; i < match.matchables.length; i++) {
			let m = match.matchables[i];
			
			if (m.x == mostX && m.y == mostY) {
				m.transformTo = Type.AreaClear3x3WhenMatched;
				m.transformToColor = m.color;
				this.matchableTransforming.trigger(m);
				
				return;
			}
		}		
	}
}

export = MatchableTransformer;