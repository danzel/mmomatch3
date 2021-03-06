///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import ComboOwnership = require('../../app/Simulation/Scoring/comboOwnership');
import OwnedMatch = require('../../app/Simulation/Scoring/ownedMatch');

class OwnershipMatchChecker {
	private matches: Array<OwnedMatch> = [];
	
	constructor(comboOwnership: ComboOwnership) {
		let matches = this.matches;
		comboOwnership.ownedMatchPerformed.on((data) => {
			if (data.players.length == 0) {
				expect('match to have owners').toBe(true);
			}
			matches.push(data);
		});
	}
	
	verifyMatch(matchableCount: number, players: Array<number>){
		expect(this.matches.length).toBeGreaterThan(0);

		var match = this.matches[0];

		match.players.sort();
		players.sort();

		expect(match.match.matchables.length).toEqual(matchableCount);
		expect(match.players).toEqual(players);
		
		this.matches.splice(0, 1);
	}
	
	verifyNoRemainingMatches() {
		expect(this.matches.length).toBe(0);
	}
}

export = OwnershipMatchChecker;