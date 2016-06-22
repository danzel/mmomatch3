import GameEndType = require('../../Simulation/Levels/gameEndType');
import FailureType = require('../../Simulation/Levels/failureType');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LevelDef = require('../../Simulation/Levels/levelDef');
import LiteEvent = require('../../liteEvent');
import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');
import VictoryType = require('../../Simulation/Levels/victoryType');
import Language = require('../../Language');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./gameOverOverlay.handlebars');
require('./gameOverOverlay.css');

var thumbsUp = require('file?name=thumbsup.png?[hash:6]!../../../img/ui/thumbsup.png');
var thumbsDown = require('file?name=thumbsdown.png?[hash:6]!../../../img/ui/thumbsdown.png');


class GameOverOverlay {
	private hasCountdown: boolean;
	countdownText: string;
	private rank: number;
	clicked = new LiteEvent<void>();

	private countdownElement: Element;
	private voteUp: HTMLDivElement;
	private voteDown: HTMLDivElement;

	constructor(private htmlOverlayManager: HtmlOverlayManager, private time: Phaser.Time, private gameEndType: GameEndType, private countdown: number, scoreTracker: ScoreTracker, playerId: number, private playerCount: number, private level: LevelDef) {

		this.rank = this.calculateRank(playerId, scoreTracker);
		this.hasCountdown = !!countdown;

		if (this.hasCountdown) {
			this.countdownText = "??? in ???";
			this.update();
		} else {
			this.countdownText = Language.t('click to continue');
			this.render();
		}
	}

	update() {
		if (this.countdown) {
			this.countdown = Math.max(0, this.countdown - this.time.physicsElapsed);
			this.countdownText = Language.t('next level in', { sec: this.countdown.toFixed(1) });

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
				bottomText: this.countdownText,
				thumbsUp,
				thumbsDown,

				_outofmoves: Language.t('out of moves'),
				_youwin: Language.t('you win'),
				_defeated: Language.t('defeated'),
				_levelcomplete: Language.t('level complete'),
				_levelfailed: Language.t('level failed'),
				_youcame: Language.t('you came', { rank: this.rank, smart_count: Math.max(this.rank, this.playerCount) }), //Hack around you getting a worse rank than current amount of players
				_ratelevel: Language.t('rate level')
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

		//Transmit
		if (this.hasCountdown) {
			let ga = (<any>window).ga;
			if (ga) {
				ga('send', 'event', 'level', 'rating', VictoryType[this.level.victoryType] + ":" + FailureType[this.level.failureType], up ? 1 : 0)
			}
		}


		this.voteUp.classList.add(up ? 'chosen' : 'notchosen');
		this.voteDown.classList.add(up ? 'notchosen' : 'chosen');
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