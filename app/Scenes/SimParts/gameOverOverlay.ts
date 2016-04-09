import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LiteEvent = require('../../liteEvent')
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./gameOverOverlay.handlebars');
require('./gameOverOverlay.css');

class GameOverOverlay {
	countdownText: string;
	private rank: number;
	clicked = new  LiteEvent<void>();
	
	constructor(private htmlOverlayManager: HtmlOverlayManager, private time: Phaser.Time, private victory: boolean, private countdown: number, scoreTracker: ScoreTracker, playerId: number, private playerCount: number) {
		
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
			this.countdownText = (this.victory ? "Next Level in " : "Restarting in ") + this.countdown.toFixed(1) + " seconds";
			
			this.render();
		}
	}
	
	private render() {
		this.htmlOverlayManager.showOverlay('game-over-overlay', template({
			header: this.victory ? "You won yay!" : "Failure :(",
			rank: this.rank,
			playerCount: this.playerCount,
			bottomText: this.countdownText
		}), () => {
			this.clicked.trigger();
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