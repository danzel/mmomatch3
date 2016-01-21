import BootData = require('../DataPackets/bootData');
import ClientSpawnManager = require('../Client/clientSpawnManager');
import Grid = require('../Simulation/grid');
import ISerializer = require('./iSerializer');
import Matchable = require('../Simulation/matchable');
import MatchableFactory = require('../Simulation/matchableFactory');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');
import SwapClientData = require('../DataPackets/swapClientData');
import SwapHandler = require('../Simulation/swapHandler');
import TickData = require('../DataPackets/tickData');

interface SerializedBoot {
	idCounter: number;
	width: number;
	height: number;
	grid: any;
	swapHandler: Array<any>;
}

class SimpleSerializer implements ISerializer {
	serializeBoot(simulation: Simulation): any {
		return {
			idCounter: simulation.matchableFactory.idForSerializing,
			width: simulation.grid.width,
			height: simulation.grid.height,
			grid: this.serializeGrid(simulation.grid),
			swapHandler: this.serializeSwapHandler(simulation.swapHandler)
		};
	}

	private serializeGrid(grid: Grid): any {
		let res = [];

		for (let x = 0; x < grid.width; x++) {
			let col = grid.cells[x];
			let newCol = [];

			for (let y = 0; y < col.length; y++) {
				newCol.push(this.serializeMatchable(col[y]));
			}
			res.push(newCol);
		}

		return res;
	}

	private serializeMatchable(matchable: Matchable): any {
		return {
			id: matchable.id,
			x: matchable.x,
			y: matchable.y,
			color: matchable.color,
			isDisappearing: matchable.isDisappearing,
			disappearingTime: matchable.disappearingTime,
			yMomentum: matchable.yMomentum,
			beingSwapped: matchable.beingSwapped
		}
	}

	private serializeSwapHandler(swapHandler: SwapHandler): any {
		let res = [];

		for (let i = 0; i < swapHandler.swaps.length; i++) {
			let swap = swapHandler.swaps[i];

			res.push({ playerId: swap.playerId, left: swap.left.id, right: swap.right.id, time: swap.time, percent: swap.percent }); //TODO: percent can be calculated
		}
		return res;
	}


	deserializeBoot(data: any): BootData {
		let json = <SerializedBoot>data;

		let matchableFactory = new MatchableFactory(json.idCounter);
		let grid = new Grid(json.width, json.height);
		let spawnManager = new ClientSpawnManager(grid, matchableFactory);
		let simulation = new Simulation(grid, spawnManager, matchableFactory);

		let matchableById = this.deserializeGrid(simulation.grid, json.grid);
		this.deserializeSwapHandler(simulation.swapHandler, json.swapHandler, matchableById);

		return new BootData(simulation);
	}

	private deserializeGrid(grid: Grid, data: Array<Array<any>>): any {
		let matchableById = {};

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

	private deserializeSwapHandler(swapHandler: SwapHandler, data: Array<any>, matchableById: any): any {
		for (let i = 0; i < data.length; i++) {
			let s = data[i];
			let swap = new Swap(s.playerId, matchableById[s.left], matchableById[s.right]);
			swap.time = s.time;
			swap.percent = s.percent;
			swapHandler.swaps.push(swap);
		}
	}

	serializeTick(tickData: TickData): any {
		return tickData;
	}

	deserializeTick(data: any): TickData {
		return <TickData>data;
	}

	serializeClientSwap(swapData: SwapClientData): any {
		return swapData;
	}

	deserializeClientSwap(data: any): SwapClientData {
		return <SwapClientData>data;
	}

	serializePlayerId(playerId: number): any {
		return playerId;
	}
	
	deserializePlayerId(data: any): number {
		return <number>data;
	}
}

export = SimpleSerializer;