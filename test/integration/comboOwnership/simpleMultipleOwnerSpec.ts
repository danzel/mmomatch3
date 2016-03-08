///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
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
			"114142422"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[5][0], simulation.grid.cells[6][0]);
		simulation.update();
		simulation.update();

		//It is fluke that these happen in this order
		ownershipChecker.verifyMatch(3, [playerId2]);
		ownershipChecker.verifyMatch(3, [playerId1, playerId2]);
		ownershipChecker.verifyMatch(3, [playerId1]);

		ownershipChecker.verifyNoRemainingMatches()
		TestUtil.expectGridQuiet(simulation);
	});
});