///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Sqlite3Storage = require('../../../app/Server/Database/sqlite3Storage');

import GameEndType = require('../../../app/Simulation/Levels/gameEndType');
import FailureType = require('../../../app/Simulation/Levels/failureType');
import LevelDef = require('../../../app/Simulation/Levels/levelDef');
import Player = require('../../../app/Simulation/Scoring/player');
import ScoreTracker = require('../../../app/Simulation/Scoring/scoreTracker');
import VictoryType = require('../../../app/Simulation/Levels/victoryType');

class FakeScoreTracker extends ScoreTracker {

}

describe('Sqlite3Storage', () => {
    it('Can create and fetch a player', (done) => {
		let storage = new Sqlite3Storage(':memory:');

		storage.ensurePlayerExists('mock', '123', 'test name', (playerId) => {
			storage.getPlayer(playerId, (player) => {
				expect(player).not.toBeNull();
				expect(player.authProvider).toBe('mock');
				expect(player.authId).toBe('123');
				expect(player.lastUsedName).toBe('test name');
				expect(player.playerId).toBe(playerId);

				//ensure again should update the name
				storage.ensurePlayerExists('mock', '123', 'test name2', (playerId2) => {
					expect(playerId2).toBe(playerId);
					storage.getPlayer(playerId, (player2) => {
						expect(player2.lastUsedName).toBe('test name2');
						done();
					});
				});
			});
		});
	});

	it('Can insert results for a level and fetch them back', (done) => {
		let storage = new Sqlite3Storage(':memory:');

		storage.ensurePlayerExists('a', '1', 'p1', (playerId1) => {
			storage.ensurePlayerExists('a', '2', 'p2', (playerId2) => {
				let p1 = new Player(1, '1', 'p1');
				p1.databaseId = playerId1;
				let p2 = new Player(2, '2', 'p2');
				p2.databaseId = playerId2;

				let scoreTracker = new FakeScoreTracker('');
				scoreTracker.points[1] = 100;
				scoreTracker.points[2] = 50;

				let level = new LevelDef(1, 10, 20, [], 6, FailureType.Time, VictoryType.Score, 100, 150);

				storage.recordLevelResult(level, GameEndType.LevelVictory, [p1, p2], scoreTracker, () => {
					storage.getLatestLevelResults(playerId1, 1, (levels) => {
						expect(levels.length).toBe(1);
						var res = levels[0];

						expect(res.colorCount).toBe(6);
						expect(res.failureType).toBe(FailureType.Time);
						expect(res.failureValue).toBe(JSON.stringify(level.failureValue));
						expect(res.gameEndType).toBe(GameEndType.LevelVictory);
						expect(res.height).toBe(20);
						expect(res.levelNumber).toBe(1);
						expect(res.playerId).toBe(playerId1);
						expect(res.playerWasOnOppositeTeam).toBeFalsy();
						expect(res.rank).toBe(1);
						expect(res.score).toBe(100);
						expect(res.victoryType).toBe(VictoryType.Score);
						expect(res.victoryValue).toBe(JSON.stringify(level.victoryValue));

						done();
					});
				})
			});
		});
	});

	it('works when a player is logged in twice', (done) => {
		let storage = new Sqlite3Storage(':memory:');

		storage.ensurePlayerExists('a', '1', 'p1', (playerId1) => {
			let p1 = new Player(1, '1', 'p1');
			p1.databaseId = playerId1;
			let p2 = new Player(2, '2', 'p2');
			p2.databaseId = playerId1;

			let scoreTracker = new FakeScoreTracker('');
			scoreTracker.points[1] = 100;
			scoreTracker.points[2] = 50;

			let level = new LevelDef(1, 10, 20, [], 6, FailureType.Time, VictoryType.Score, 100, 150);

			storage.recordLevelResult(level, GameEndType.LevelVictory, [p1, p2], scoreTracker, () => {
				storage.getLatestLevelResults(playerId1, 1, (levels) => {
					expect(levels.length).toBe(1);
					var res = levels[0];

					expect(res.playerId).toBe(playerId1);

					done();
				});
			})
		});
	});

	//record level results
	//record level results with player logged in twice

	//get latest with limit
});