import BootData = require('./bootData');
import GridData = require('./BootParts/gridData');
import MatchableData = require('./BootParts/matchableData');
import SwapData = require('./BootParts/swapData');
import SwapHandlerData = require('./BootParts/swapHandlerData');

import ClientSpawnManager = require('../Client/clientSpawnManager');
import Grid = require('../Simulation/grid');
import Matchable = require('../Simulation/matchable');
import MatchableFactory = require('../Simulation/matchableFactory');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');
import SwapHandler = require('../Simulation/swapHandler');

class PacketGenerator {
	generateBootData(simulation: Simulation): BootData {
		return new BootData(
			simulation.matchableFactory.idForSerializing,
			simulation.grid.width,
			simulation.grid.height,
			this.generateGridData(simulation.grid),
			this.generateSwapHandlerData(simulation.swapHandler)
		);
	}

	private generateGridData(grid: Grid): GridData {
		let res: Array<Array<MatchableData>> = [];

		for (let x = 0; x < grid.width; x++) {
			let col = grid.cells[x];
			let newCol: Array<MatchableData> = [];

			for (let y = 0; y < col.length; y++) {
				newCol.push(this.serializeMatchable(col[y]));
			}
			res.push(newCol);
		}

		return new GridData(res);
	}

	private serializeMatchable(matchable: Matchable): MatchableData {
		return new MatchableData(
			matchable.id,
			matchable.x,
			matchable.y,
			matchable.color,
			matchable.isDisappearing,
			matchable.disappearingTime,
			matchable.yMomentum,
			matchable.beingSwapped
		);
	}

	private generateSwapHandlerData(swapHandler: SwapHandler): SwapHandlerData {
		let res:Array<SwapData> = [];

		for (let i = 0; i < swapHandler.swaps.length; i++) {
			let swap = swapHandler.swaps[i];

			res.push(new SwapData(swap.playerId, swap.left.id, swap.right.id, swap.time, swap.percent)); //TODO: percent (or time) can be calculated
		}
		return new SwapHandlerData(res);
	}



	recreateSimulation(bootData: BootData): Simulation {
		let matchableFactory = new MatchableFactory(bootData.matchableIdCounter);
		let grid = new Grid(bootData.width, bootData.height);
		let spawnManager = new ClientSpawnManager(grid, matchableFactory);
		let simulation = new Simulation(grid, spawnManager, matchableFactory);

		let matchableById = this.deserializeGrid(simulation.grid, bootData.grid);
		this.deserializeSwapHandler(simulation.swapHandler, bootData.swapHandler, matchableById);

		return simulation;
	}

	private deserializeGrid(grid: Grid, gridData: GridData): any {
		let matchableById:{[id: number]: Matchable} = {};
		let data = gridData.matchables;
		
		for (let x = 0; x < data.length; x++) {
			let dataCol = data[x];
			let col = grid.cells[x];

			for (let y = 0; y < dataCol.length; y++) {
				let matchableData = dataCol[y];
				
				//We aren't using the factory here, if we did the id would get out of sync
				let matchable = new Matchable(matchableData.id, matchableData.x, matchableData.y, matchableData.color);
				matchable.isDisappearing = matchableData.isDisappearing;
				matchable.disappearingTime = matchableData.disappearingTime;
				matchable.yMomentum = matchableData.yMomentum;
				matchable.beingSwapped = matchableData.beingSwapped;

				col.push(matchable);
				matchableById[matchable.id] = matchable;
			}
		}

		return matchableById;
	}

	private deserializeSwapHandler(swapHandler: SwapHandler, swapHandlerData: SwapHandlerData, matchableById: any): any {
		let data = swapHandlerData.swaps;
		
		for (let i = 0; i < data.length; i++) {
			let s = data[i];
			let swap = new Swap(s.playerId, matchableById[s.leftId], matchableById[s.rightId]);
			swap.time = s.time;
			swap.percent = s.percent;
			swapHandler.swaps.push(swap);
		}
	}

}

export = PacketGenerator;