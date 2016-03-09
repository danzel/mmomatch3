import Client = require('./client');
import ClientInputApplier = require('./clientInputApplier');
import ClientSpawnManager = require('./clientSpawnManager');
import FrameData = require('../DataPackets/frameData');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import InputVerifier = require('../Simulation/inputVerifier');
import LevelDef = require('../Simulation/Levels/levelDef');
import Simulation = require('../Simulation/simulation');
import TickData = require('../DataPackets/tickData');

class ClientSimulationHandler {
	inputApplier: ClientInputApplier;

	private frameQueue = new Array<FrameData>();

	constructor(public level: LevelDef, public simulation: Simulation, public gameEndDetector: GameEndDetector, client: Client, private tickRate: number) {
		this.inputApplier = new ClientInputApplier(client, new InputVerifier(simulation.grid, simulation.matchChecker, true), simulation.grid);
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
			//Swaps
			for (let i = 0; i < frame.swapData.length; i++) {
				var swap = frame.swapData[i];
				var left = this.simulation.grid.findMatchableById(swap.leftId);
				var right = this.simulation.grid.findMatchableById(swap.rightId);
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