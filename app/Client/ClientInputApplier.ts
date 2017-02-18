import Client = require('./client');
import EmoteProxy = require('../Util/emoteProxy');
import Grid = require('../Simulation/grid');
import InputApplier = require('../Simulation/inputApplier');
import InputVerifier = require('../Simulation/inputVerifier');
import Matchable = require('../Simulation/matchable');

class ClientInputApplier extends InputApplier {
	private client: Client;

	constructor(client: Client, inputVerifier: InputVerifier, grid: Grid, private emoteProxy: EmoteProxy) {
		super(inputVerifier, grid);

		this.client = client;
	}

	protected performSwap(left: Matchable, right: Matchable): void {
		this.client.sendSwap(left.id, right.id);
	}

	emote(emoteNumber: number, x: number, y: number): void {
		this.client.sendEmote(emoteNumber, x, y);

		this.emoteProxy.emoteTriggered.trigger({
			emoteNumber,
			gridX: x,
			gridY: y
		})
	}
}

export = ClientInputApplier;