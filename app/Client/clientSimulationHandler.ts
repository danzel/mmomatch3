import Client = require('./client');
import ClientInputApplier = require('./clientInputApplier');
import ClientSpawnManager = require('./clientSpawnManager');
import EmoteProxy = require('../Util/emoteProxy');
import FrameData = require('../DataPackets/frameData');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import InputVerifier = require('../Simulation/inputVerifier');
import LevelDef = require('../Simulation/Levels/levelDef');
import Simulation = require('../Simulation/simulation');
import TickData = require('../DataPackets/tickData');

class ClientSimulationHandler {
	emoteProxy: EmoteProxy;
	inputApplier: ClientInputApplier;

	private frameQueue = new Array<FrameData>();

	constructor(public level: LevelDef, public simulation: Simulation, public gameEndDetector: GameEndDetector, client: Client, private tickRate: number) {
		this.emoteProxy = new EmoteProxy();
		this.inputApplier = new ClientInputApplier(client, simulation.inputVerifier, simulation.grid, this.emoteProxy);
	}

	tickReceived(tickData: TickData) {
		//Apply the frameQueue, keep some so we are less affected by lag
		while (this.frameQueue.length > 2) {
			this.update();
		}

		for (let i = 0; i < tickData.framesElapsed; i++) {
			this.frameQueue.push(tickData.frameData[i]);
		}
	}

	update(): boolean {
		if (this.frameQueue.length == 0) {
			return false;
		}
		
		let frame = this.frameQueue.shift();

		if (frame) {
			if (this.simulation.framesElapsed != frame.frame) {
				throw new Error("At bad frame. " + this.simulation.framesElapsed + " " + frame.frame + " Q " + this.frameQueue.length + " L " + this.level.levelNumber);
			}

			//Swaps
			for (let i = 0; i < frame.swapData.length; i++) {
				var swap = frame.swapData[i];
				var left = this.simulation.grid.findMatchableById(swap.leftId);
				var right = this.simulation.grid.findMatchableById(swap.rightId);

				//Trying to get a good error...
				if (!left || !right) {
					let error = 'Q ' + this.frameQueue.length + ' @ ' + this.level.levelNumber + ' (' + swap.leftId + ',' + swap.rightId + ') ';
					if (!left) {
						error += 'L';

						let closestId = 0;
						let closestDiff = Number.MAX_VALUE; 
						this.simulation.grid.cells.forEach(col => col.forEach(m => {
							let diff = Math.abs(m.id - swap.leftId);
							if (diff < closestDiff) {
								closestId = m.id;
								closestDiff = diff;
							}
						}));
						error += '[' + closestId + '] ';
					}
					if (!right) {
						error += 'R';

						let closestId = 0;
						let closestDiff = Number.MAX_VALUE; 
						this.simulation.grid.cells.forEach(col => col.forEach(m => {
							let diff = Math.abs(m.id - swap.rightId);
							if (diff < closestDiff) {
								closestId = m.id;
								closestDiff = diff;
							}
						}));
						error += '[' + closestId + '] ';
					}

					throw new Error("Failed to swap at frame " + this.simulation.framesElapsed + ' ' + error);
				}
				this.simulation.swapHandler.swap(swap.playerId, left, right);
			}
			
			//Spawns
			(<ClientSpawnManager>this.simulation.spawnManager).notifySpawns(frame.spawnData);
		}

		this.simulation.update();
		
		return true;
	}
}

export = ClientSimulationHandler;