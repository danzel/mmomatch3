import Grid = require('../Simulation/grid');
import ISerializer = require('./iSerializer');
import Matchable = require('../Simulation/matchable');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');
import SwapHandler = require('../Simulation/swapHandler');

//TODO: matchable id counter

class SimpleSerializer implements ISerializer {
	serialize(simulation: Simulation) : any {
		return JSON.stringify({
			idCounter: Matchable.IdCounter,
			width: simulation.grid.width,
			height: simulation.grid.height,
			grid: this.serializeGrid(simulation.grid),
			swapHandler: this.serializeSwapHandler(simulation.swapHandler)
		});
	}
	
	private serializeGrid(grid: Grid) : any {
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
	
	private serializeMatchable(matchable: Matchable) : any {
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
	
	private serializeSwapHandler(swapHandler: SwapHandler) : any {
		let res = [];
		
		for (let i = 0; i < swapHandler.swaps.length; i++) {
			let swap = swapHandler.swaps[i];
			
			res.push({ left: swap.left.id, right: swap.right.id, time: swap.time, percent: swap.percent }); //TODO: percent can be calculated
		}
		return res;
	}
	
	
	deserialize(data: any): Simulation {
		let json = JSON.parse(data);
		
		let simulation = new Simulation(json.width, json.height);
		
		let matchableById = this.deserializeGrid(simulation.grid, json.grid);
		this.deserializeSwapHandler(simulation.swapHandler, json.swapHandler, matchableById);
		
		Matchable.IdCounter = json.idCounter;
		
		return simulation;
	}

	private deserializeGrid(grid: Grid, data: Array<Array<any>>) : any {
		let matchableById = {};
		
		for (let x = 0; x < data.length; x++) {
			let dataCol = data[x];
			let col = grid.cells[x];
			
			for (let y = 0; y < dataCol.length; y++) {
				let matchableData = dataCol[y];
				
				let matchable = new Matchable(matchableData.x, matchableData.y, matchableData.color);
				matchable.id = matchableData.id;
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
	
	private deserializeSwapHandler(swapHandler: SwapHandler, data: Array<any>, matchableById: any) : any {
		for (let i = 0; i < data.length; i++) {
			let s = data[i];
			let swap = new Swap(matchableById[s.left], matchableById[s.right]);
			swap.time = s.time;
			swap.percent = s.percent;
			swapHandler.swaps.push(swap);
		}
	}
}

export = SimpleSerializer;