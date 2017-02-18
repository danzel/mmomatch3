import EmoteProxy = require('../../Util/emoteProxy');
import Grid = require('../grid');
import InputApplier = require('../inputApplier');
import InputVerifier = require('../inputVerifier');
import Matchable = require('../matchable');
import SwapHandler = require('../swapHandler');

class DirectInputApplier extends InputApplier {
	lastX: number;
	lastY: number;
	constructor(private playerId: number, private swapHandler: SwapHandler, inputVerifier: InputVerifier, grid: Grid, private emoteProxy: EmoteProxy) {
		super(inputVerifier, grid);
	}

	protected performSwap(left: Matchable, right: Matchable): void {
		this.lastX = (left.x + right.x) / 2;
		this.lastY = (left.y + right.y) / 2;

		this.swapHandler.swap(this.playerId, left, right);
	}

	emote(emoteNumber: number): void {
		this.emoteProxy.emoteTriggered.trigger({
			emoteNumber,
			gridX: this.lastX,
			gridY: this.lastY
		})
	}
}

export = DirectInputApplier; 