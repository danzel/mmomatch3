import ComboOwnership = require('../comboOwnership');
import Grid = require('../../grid');
import Language = require('../../../Language');
import OwnedMatch = require('../ownedMatch');
import Score = require('../score');
import ScoreTracker = require('../scoreTracker');
import Swap = require('../../swap');
import SwapHandler = require('../../swapHandler');
import Type = require('../../type');

class GetThingsToBottomScoreTracker extends ScoreTracker {
	constructor(comboOwnership: ComboOwnership, private grid: Grid, swapHandler: SwapHandler) {
		super(Language.t('robodrops'));
		comboOwnership.ownedMatchPerformed.on((data) => { this.ownedMatchPerformed(data); });
		swapHandler.swapOccurred.on(swap => this.swapOccurred(swap));
	}

	private ownedMatchPerformed(data: OwnedMatch): void {
		let amountDropping = 0;

		for (let i = 0; i < data.matchables.length; i++) {
			//Scan down above to check if there is a GetToBottom
			let foundOne = false;
			let m = data.matchables[i];
			let col = this.grid.cells[m.x];
			for (var y = col.length - 1; col[y].y > m.y && !foundOne; y--) {
				if (col[y].type == Type.GetToBottom) {
					foundOne = true;
				}
			}

			if (foundOne) {
				amountDropping++;
			}
		}

		if (amountDropping > 0) {
			for (let j = 0; j < data.players.length; j++) {
				let playerId = data.players[j]
				this.points[playerId] = (this.points[playerId] || 0) + amountDropping;
				this.playerEarnedPoints.trigger(new Score(playerId, amountDropping));
			}
		}
	}

	private swapOccurred(swap: Swap): void {
		if ((swap.left.type == Type.GetToBottom && swap.left.y > swap.right.y) || (swap.right.type == Type.GetToBottom && swap.right.y > swap.left.y)) {
			//Moved the robot up, lose a point
			this.points[swap.playerId] = (this.points[swap.playerId] || 0) - 1;
			this.playerEarnedPoints.trigger(new Score(swap.playerId, -1));
		} else if ((swap.left.type == Type.GetToBottom && swap.left.y < swap.right.y) || (swap.right.type == Type.GetToBottom && swap.right.y < swap.left.y)) {
			//Moved the robot down, gain a point
			this.points[swap.playerId] = (this.points[swap.playerId] || 0) + 1;
			this.playerEarnedPoints.trigger(new Score(swap.playerId, 1));
		}
	}
}
export = GetThingsToBottomScoreTracker;