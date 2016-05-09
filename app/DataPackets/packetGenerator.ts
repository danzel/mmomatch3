import BootData = require('./bootData');
import GridData = require('./BootParts/gridData');
import LevelDefData = require('./BootParts/levelDefData');
import MatchableData = require('./BootParts/matchableData');
import RequireMatchData = require('./BootParts/requireMatchData');
import SimulationData = require('./BootParts/simulationData');
import SwapData = require('./BootParts/swapData');
import SwapHandlerData = require('./BootParts/swapHandlerData');

import ClientSpawnManager = require('../Client/clientSpawnManager');
import DefaultLevelAndSimulationProvider = require('../Server/defaultLevelAndSimulationProvider');
import Grid = require('../Simulation/grid');
import GridFactory = require('../Simulation/Levels/gridFactory');
import LevelDef = require('../Simulation/Levels/levelDef');
import Matchable = require('../Simulation/matchable');
import MatchableFactory = require('../Simulation/matchableFactory');
import NewNameCollection = require('../Server/newNameCollection');
import RequireMatch = require('../Simulation/requireMatch');
import RequireMatchInCellTracker = require('../Simulation/requireMatchInCellTracker');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');
import SwapHandler = require('../Simulation/swapHandler');

import PointsScoreTracker = require('../Simulation/Scoring/ScoreTrackers/pointsScoreTracker');

class PacketGenerator {
	generateBootData(level: LevelDef, simulation: Simulation, newNameCollection: NewNameCollection, endAvailabilityDate: string): BootData {
		return new BootData(
			this.generateLevelDefData(level),
			this.generateGridData(simulation.grid),
			this.generateSwapHandlerData(simulation.swapHandler),
			this.generateSimulationData(simulation),
			this.generateRequireMatchData(simulation.requireMatchInCellTracker),
			this.generateNewNameCollectionData(newNameCollection),
			endAvailabilityDate
		);
	}

	private generateLevelDefData(level: LevelDef): LevelDefData {
		return <LevelDefData>level;
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
			matchable.type,
			matchable.isDisappearing,
			matchable.disappearingTime,
			matchable.yMomentum,
			matchable.beingSwapped,
			matchable.transformTo,
			matchable.transformToColor
		);
	}

	private generateSwapHandlerData(swapHandler: SwapHandler): SwapHandlerData {
		let res: Array<SwapData> = [];

		for (let i = 0; i < swapHandler.swaps.length; i++) {
			let swap = swapHandler.swaps[i];

			res.push(new SwapData(swap.playerId, swap.left.id, swap.right.id, swap.time, swap.percent)); //TODO: percent (or time) can be calculated
		}
		return new SwapHandlerData(res, swapHandler.totalSwapsCount);
	}

	private generateSimulationData(simulation: Simulation): SimulationData {
		let scoreTracker = simulation.scoreTracker;

		return new SimulationData(
			simulation.matchableFactory.idForSerializing,
			simulation.framesElapsed,
			simulation.tickRate,
			simulation.matchPerformer.totalMatchablesMatched,
			simulation.scoreTracker.points,
			(scoreTracker instanceof PointsScoreTracker) ? scoreTracker.playerComboSize : null,
			this.generateComboOwners(simulation),
			simulation.simulationStats.matchesByColor.slice()
		);
	}

	private generateComboOwners(simulation: Simulation): Array<{ x: number, y: number, playerId: number }> {
		let res = new Array<{ x: number, y: number, playerId: number }>();

		let owners = simulation.comboOwnership.getComboOwners();
		for (let x = 0; x < owners.length; x++) {
			let col = owners[x];
			for (let y = 0; y < col.length; y++) {
				let owner = col[y];

				res.push({ x: x, y: owner.y, playerId: owner.playerId });
			}
		}

		return res;
	}

	private generateRequireMatchData(requireMatch: RequireMatchInCellTracker): RequireMatchData {
		let res = new RequireMatchData()

		for (let i = 0; i < requireMatch.requirements.length; i++) {
			let r = requireMatch.requirements[i];

			res.data.push({ x: r.x, y: r.y, amount: r.amount });
		}

		return res;
	}

	private generateNewNameCollectionData(newNameCollection: NewNameCollection): { [id: number]: string } {
		if (newNameCollection.newNames.length == 0) {
			return null;
		}
		
		var res: { [id: number]: string } = {};
		newNameCollection.newNames.forEach(p => res[p.id] = p.name);
		return res;
	}

	recreateLevelDefData(level: LevelDefData): LevelDef {
		return <LevelDef>level;
	}

	recreateSimulation(bootData: BootData, level: LevelDef): Simulation {
		let matchableFactory = new MatchableFactory(bootData.simulationData.matchableIdCounter);
		let grid = GridFactory.createGrid(bootData.level);
		let spawnManager = new ClientSpawnManager(grid, matchableFactory);
		let simulation = new Simulation(grid, spawnManager, matchableFactory, bootData.simulationData.tickRate);
		simulation.scoreTracker = DefaultLevelAndSimulationProvider.createScoreTracker(level, simulation)

		//Points
		Object.keys(bootData.simulationData.pointsData).forEach(key => {
			let playerId = parseInt(key, 10);
			let points = bootData.simulationData.pointsData[playerId];
			simulation.scoreTracker.points[playerId] = points;
			simulation.scoreTracker.totalPoints += points;
		});
		//Combo Size
		if (bootData.simulationData.comboSize) {
			Object.keys(bootData.simulationData.comboSize).forEach(key => {
				let playerId = parseInt(key, 10);
				let size = bootData.simulationData.comboSize[playerId];
				(<PointsScoreTracker>(simulation.scoreTracker)).playerComboSize[playerId] = size;
			})
		}
		//Combo owners
		bootData.simulationData.comboOwners.forEach(owner => {
			simulation.comboOwnership.addComboOwner(owner.x, owner.y, owner.playerId);
		});
		//Matches by Color
		for (let i = 0; i < bootData.simulationData.matchesByColor.length; i++) {
			simulation.simulationStats.matchesByColor[i] = bootData.simulationData.matchesByColor[i];
		}

		//Swap handler
		let matchableById = this.deserializeGrid(simulation.grid, bootData.grid);
		this.deserializeSwapHandler(simulation.swapHandler, bootData.swapHandler, matchableById);

		//QuietColumnDetector
		simulation.swapHandler.swaps.forEach(swap => {
			simulation.quietColumnDetector.columnIsQuiet[swap.left.x] = false;
			simulation.quietColumnDetector.columnIsQuiet[swap.right.x] = false;
			simulation.quietColumnDetector.columnSwapsInProgressCount[swap.left.x]++;
			simulation.quietColumnDetector.columnSwapsInProgressCount[swap.right.x]++;
			simulation.quietColumnDetector.gridIsQuiet = false;
		});
		simulation.grid.cells.forEach(col => col.forEach(matchable => {
			if (matchable.isDisappearing) {
				simulation.quietColumnDetector.columnIsQuiet[matchable.x] = false;
				simulation.quietColumnDetector.columnDisappearingCount[matchable.x]++;
				simulation.quietColumnDetector.gridIsQuiet = false;
			}
			if (matchable.isMoving) {
				simulation.quietColumnDetector.columnIsQuiet[matchable.x] = false;
				simulation.quietColumnDetector.gridIsQuiet = false;
			}
		}));

		bootData.requireMatchData.data.forEach(req => {
			simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(req.x, req.y, req.amount));
		})

		//Misc fields
		simulation.framesElapsed = bootData.simulationData.framesElapsed;
		simulation.matchPerformer.totalMatchablesMatched = bootData.simulationData.totalMatchablesMatched;

		return simulation;
	}

	private deserializeGrid(grid: Grid, gridData: GridData): any {
		let matchableById: { [id: number]: Matchable } = {};
		let data = gridData.matchables;

		for (let x = 0; x < data.length; x++) {
			let dataCol = data[x];
			let col = grid.cells[x];

			for (let y = 0; y < dataCol.length; y++) {
				let matchableData = dataCol[y];

				//We aren't using the factory here, if we did the id would get out of sync
				let matchable = new Matchable(matchableData.id, matchableData.x, matchableData.y, matchableData.color, matchableData.type);
				matchable.isDisappearing = matchableData.isDisappearing;
				matchable.disappearingTime = matchableData.disappearingTime;
				matchable.yMomentum = matchableData.yMomentum;
				matchable.beingSwapped = matchableData.beingSwapped;
				matchable.transformTo = matchableData.transformTo;
				matchable.transformToColor = matchableData.transformToColor;

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

		swapHandler.totalSwapsCount = swapHandlerData.totalSwapsCount;
	}

}

export = PacketGenerator;