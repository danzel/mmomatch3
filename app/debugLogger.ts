import Simulation = require ('./Simulation/simulation');

class DebugLogger {
	constructor(private simulation: Simulation) {
		simulation.physics.matchableLanded.on((matchable) => {
			console.log(simulation.framesElapsed, 'landed', matchable.x, matchable.y);
		});
		/*simulation.spawnManager.matchableSpawned.on((matchable) => {
			console.log(simulation.framesElapsed, 'spawned', matchable);
		});*/
		simulation.swapHandler.swapOccurred.on((swap) => {
			console.log(simulation.framesElapsed, 'swap', swap.left.x, swap.left.y, swap.right.x, swap.right.y);
		});
	}
}

export = DebugLogger;