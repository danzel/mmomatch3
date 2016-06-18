import GameEndType = require('../../Simulation/Levels/gameEndType');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LiteEvent = require('../../liteEvent')
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./gameOverOverlay.handlebars');
require('./gameOverOverlay.css');

var thumbsUp = require('file?name=thumbsup.png?[hash:6]!../../../img/ui/thumbsup.png');
var thumbsDown = require('file?name=thumbsdown.png?[hash:6]!../../../img/ui/thumbsdown.png');


class GameOverOverlay {
	countdownText: string;
	private rank: number;
	clicked = new LiteEvent<void>();

	private countdownElement: Element;
	private voteUp: HTMLDivElement;
	private voteDown: HTMLDivElement;

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

			if (this.countdownElement) {
				this.countdownElement.innerHTML = this.countdownText;
			} else {
				this.render();
			}
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
				bottomText: this.countdownText,
				thumbsUp,
				thumbsDown
			}),
			closeOnBackgroundClick: !this.countdown,
			closedCallback: () => this.clicked.trigger(),
			showBannerAd: true,
			postRenderCallback: () => {
				this.countdownElement = this.htmlOverlayManager.element.getElementsByClassName('bottom')[0];
				this.voteUp = <HTMLDivElement>this.htmlOverlayManager.element.getElementsByClassName('vote up')[0];
				this.voteDown = <HTMLDivElement>this.htmlOverlayManager.element.getElementsByClassName('vote down')[0];

				this.voteUp.addEventListener('click', () => this.vote(true));
				this.voteDown.addEventListener('click', () => this.vote(false));
			}
		});
	}

	private haveVoted = false;

	private vote(up: boolean) {
		if (this.haveVoted) {
			return;
		}
		this.haveVoted = true;
		//TODO: Transmit

		if (up) {
			this.voteDown.style.opacity = '0.4';
		} else {
			this.voteUp.style.opacity = '0.4';
		}
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