///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import ComboOwnership = require('../../../app/Simulation/Scoring/comboOwnership');
import Grid = require('../../../app/Simulation/grid');
import QuietColumnDetector = require('../../../app/Simulation/quietColumnDetector');
import MatchableFactory = require('../../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('../../util/neverSpawnManager');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import OwnedMatch = require('../../../app/Simulation/Scoring/ownedMatch');
import Simulation = require('../../../app/Simulation/simulation');
import TestUtil = require('../../util/util');

let playerId1 = 99;
let playerId2 = 95;

describe('ComboOwnership.simpleMultipleOwner', () => {
    it('gives ownership of a match that two players swapped in to', () => {

		let simulation = TestUtil.prepareForTest([
			"2255",
			"1121"
		]);
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, simulation.quietColumnDetector);

		let ownershipChecker = new OwnershipMatchChecker(ownership);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		simulation.update(1);
		simulation.update(1);
		//At this stage everything should have stopped moving, so ownership from the first match should be cleared
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		simulation.update(1);

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId2]); 

		ownershipChecker.verifyNoRemainingMatches()
	});
});