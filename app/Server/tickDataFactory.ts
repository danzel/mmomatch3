import FrameData = require('../DataPackets/frameData');
import Matchable = require('../Simulation/matchable');
import ScoreTracker = require('../Simulation/Scoring/scoreTracker');
import Simulation = require('../Simulation/simulation');
import SpawnData = require('../DataPackets/spawnData');
import Swap = require('../Simulation/swap');
import SwapServerData = require('../DataPackets/swapServerData');
import TickData = require('../DataPackets/tickData');
import TickPoints = require('../DataPackets/tickPoints');

class TickDataFactory {
	
	private lastSentFramesElapsed: number = 0;
	private lastSentPointsFramesElapsed: number = 0;
	private frameData: { [frame: number]: FrameData } = {};

	constructor(private simulation: Simulation, private scoreTracker: ScoreTracker, private framesPerTick: number) {
		this.lastSentFramesElapsed = this.simulation.framesElapsed;

		simulation.swapHandler.swapStarted.on(this.onSwapStarted.bind(this))
		simulation.spawnManager.matchableSpawned.on(this.onMatchableSpawned.bind(this))
	}
	onSwapStarted(swap: Swap) {
		this.ensureFrameData().swapData.push(new SwapServerData(swap.playerId, swap.left.id, swap.right.id));
	}

	onMatchableSpawned(matchable: Matchable) {
		this.ensureFrameData().spawnData.push(new SpawnData(matchable.x, matchable.color));
	}

	private ensureFrameData(): FrameData {
		var frame = this.simulation.framesElapsed - this.lastSentFramesElapsed;
		if (!this.frameData[frame]) {
			this.frameData[frame] = new FrameData();
		}
		return this.frameData[frame];
	}
	
	getTickIfReady(playerCount: number): TickData {
		let elapsed = this.simulation.framesElapsed - this.lastSentFramesElapsed;

		if (elapsed < this.framesPerTick)
			return null;

		this.lastSentFramesElapsed = this.simulation.framesElapsed;
		let res = new TickData(elapsed, this.frameData);
		this.frameData = {};

		//Send player count every 2 seconds
		if (this.simulation.framesElapsed - this.lastSentPointsFramesElapsed > 2 * 60) {
			this.lastSentPointsFramesElapsed = this.simulation.framesElapsed;
			
			res.playerCount = playerCount;
		}
		
		return res;
	}
}

export = TickDataFactory;