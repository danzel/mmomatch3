import GameEndType = require('../../Simulation/Levels/gameEndType');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LiteEvent = require('../../liteEvent')
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./gameOverOverlay.handlebars');
require('./gameOverOverlay.css');

class GameOverOverlay {
	countdownText: string;
	private rank: number;
	clicked = new LiteEvent<void>();

	constructor(private htmlOverlayManager: HtmlOverlayManager, private time: Phaser.Time, private gameEndType: GameEndType, private countdown: number, scoreTracker: ScoreTracker, playerId: number, private playerCount: number) {

		this.rank = this.calculateRank(playerId, scoreTracker);

		if (countdown) {
			this.countdownText = "??? in ???";
			this.update();
		} else {
			this.countdownText = "Click to continue";
			this.render();
		}
	}

	update() {
		if (this.countdown) {
			this.countdown = Math.max(0, this.countdown - this.time.physicsElapsed);
			this.countdownText = "Next Level in " + this.countdown.toFixed(1) + " seconds";

			this.render();
		}
	}

	private render() {
		this.htmlOverlayManager.showOverlay({
			className: 'frame game-over-overlay',
			content: template({
				isTeam: (this.gameEndType == GameEndType.TeamDefeat || this.gameEndType == GameEndType.TeamVictory),
				victory: (this.gameEndType == GameEndType.LevelVictory || this.gameEndType == GameEndType.TeamVictory),
				isOutOfMoves: (this.gameEndType == GameEndType.NoMovesFailure),
				rank: this.rank,
				playerCount: Math.max(this.rank, this.playerCount), //Hack around you getting a worse rank than current amount of players 
				bottomText: this.countdownText
			}),
			closeOnBackgroundClick: true,
			closedCallback: () => this.clicked.trigger()
		});
	}

	private calculateRank(playerId: number, scoreTracker: ScoreTracker): number {
		let score = scoreTracker.points[playerId] || 0;

		let rank = 1;
		for (let i in scoreTracker.points) {
			if (parseInt(i) != playerId && scoreTracker.points[i] > score) {
				rank++;
			}
		}

		return rank;
	}
}

export = GameOverOverlay;