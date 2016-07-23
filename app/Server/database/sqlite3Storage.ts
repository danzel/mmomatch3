///<reference path="../../../typings/sqlite3/sqlite3.d.ts"/>
import fs = require('fs');
import sqlite3 = require('sqlite3');

import GameEndType = require('../../Simulation/Levels/gameEndType');
import LevelDef = require('../../Simulation/Levels/levelDef');
import Player = require('../../Simulation/Scoring/player');
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');
import DataStorage = require('./dataStorage');
import TeamLogic = require('../../Simulation/Levels/teamLogic');

import LevelModel = require('./Models/levelModel');
import LevelPlayerModel = require('./Models/levelPlayerModel');
import PlayerModel = require('./Models/playerModel');


class Sqlite3Storage implements DataStorage {
	private db: sqlite3.Database;
	constructor(filename: string) {
		let dbExists = filename != ':memory:' && fs.existsSync(filename);

		sqlite3.verbose();
		this.db = new sqlite3.Database(filename, (err: Error) => {
			if (err) {
				console.log('fail', err);
			}
		});

		if (!dbExists) {
			this.createTables();
		}
	}

	close() {
		this.db.close((err: Error) => {
			console.log('close fail', err);
		});
		this.db = null;
	}

	ensurePlayerExists(authProvider: string, authId: string, name: string, done: (playerId: number) => void): void {
		this.db.get('SELECT playerId FROM players WHERE authProvider=? AND authId=?', [authProvider, authId], (err: Error, row: any) => {
			if (err) {
				throw err;
			}
			if (row && row.playerId) {
				this.db.run("UPDATE players SET lastUsedName=? WHERE playerId=?", name, row.playerId, (err: Error) => {
					if (err) {
						throw err;
					}
					done(row.playerId);
				});
			} else {
				//INSERT
				this.db.run("INSERT INTO players (authProvider, authId, lastUsedName) VALUES (?,?,?)", authProvider, authId, name, (err: Error) => {
					if (err) {
						throw err;
					}
					this.db.get("SELECT last_insert_rowid() as playerId", (err, row) => {
						if (err) {
							throw err;
						}
						done(row.playerId);
					});
				});
			}
		});
	}

	recordLevelResult(level: LevelDef, gameEndType: GameEndType, players: Array<Player>, scoreTracker: ScoreTracker, done?: () => void): void {
		//insert level
		this.db.run("INSERT INTO levels VALUES (?,?,?,?,?,?,?,?,?)",
			level.levelNumber,
			level.width,
			level.height,
			level.colorCount,
			level.failureType,
			level.victoryType,
			JSON.stringify(level.failureValue),
			JSON.stringify(level.victoryValue),
			gameEndType,
			(err: Error) => {
				if (err) {
					throw err;
				}

				let stmt = this.db.prepare('INSERT INTO levelplayers VALUES (?,?,?,?,?)', (err: Error) => {
					if (err) {
						throw err;
					}
				});

				//Figure out ranks
				let array = new Array<{ databaseId: number, points: number, oppositeTeam: boolean }>();
				players.forEach(p => {
					let oppositeTeam = false;
					if (TeamLogic.levelTypeIsTeamBased(level) && TeamLogic.playerIsOnOppositeTeam(p.id)) {
						oppositeTeam = true;
					}

					array.push({ databaseId: p.databaseId, points: scoreTracker.points[p.id] || 0, oppositeTeam });
				});
				array.sort((a, b) => {
					return b.points - a.points;
				});

				//insert player rows
				let haveInserted: { [databaseId: number]: boolean } = {};
				for (let i = 0; i < array.length; i++) {
					let p = array[i];
					if (p.databaseId && !haveInserted[p.databaseId]) {
						haveInserted[p.databaseId] = true;
						stmt.run(level.levelNumber, p.databaseId, i + 1, p.points, p.oppositeTeam, (err: Error) => {
							if (err) {
								throw err;
							}
						});
					}
				}

				stmt.finalize((err: Error) => {
					if (err) {
						throw err;
					}
					if (done) {
						done();
					}
				});
			});
	}

	getPlayer(playerId: number, done: (player: PlayerModel) => void): void {
		this.db.get("SELECT * FROM players WHERE playerid=?", playerId, (err: Error, row: any) => {
			done(row);
		});
	}

	getLatestLevelResults(playerDbId: number, count: number, done: (levels: Array<LevelModel & LevelPlayerModel>) => void): void {
		this.db.all("SELECT * FROM levels JOIN levelplayers USING (levelNumber) WHERE playerId=? ORDER BY levelNumber DESC limit ?", playerDbId, count, (err: Error, rows: Array<any>) => {
			done(rows);
		})
	}

	private createTables(): void {
		this.db.serialize(() => {
			this.db.run('CREATE TABLE players (' +
				'playerId INTEGER PRIMARY KEY AUTOINCREMENT,' +
				'authProvider TEXT NOT NULL,' +
				'authId TEXT NOT NULL,' +
				'lastUsedName TEXT' +
				')');
			this.db.run('CREATE UNIQUE INDEX playerauth ON players (authProvider, authId)');

			this.db.run('CREATE TABLE levels (' +
				'levelNumber INTEGER PRIMARY KEY,' +
				'width INTEGER NOT NULL,' +
				'height INTEGER NOT NULL,' +
				'colorCount INTEGER NOT NULL,' +
				'failureType INTEGER NOT NULL,' +
				'victoryType INTEGER NOT NULL,' +
				'failureValue TEXT NOT NULL,' +
				'victoryValue TEXT NOT NULL,' +
				'gameEndType INTEGER NOT NULL' +
				')');

			this.db.run('CREATE TABLE levelplayers (' +
				'levelNumber INTEGER NOT NULL,' +
				'playerId INTEGER NOT NULL,' +
				'rank INTEGER NOT NULL,' +
				'score INTEGER NOT NULL,' +
				'playerWasOnOppositeTeam BOOLEAN NOT NULL' +
				')');
			this.db.run('CREATE UNIQUE INDEX levelplayersbyplayer ON levelplayers (playerId, levelNumber)');
		});
	}
};

export = Sqlite3Storage;