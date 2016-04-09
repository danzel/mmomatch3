import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LiteEvent = require('../../liteEvent')

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./gameOverOverlay.handlebars');
require('./gameOverOverlay.css');

class GameOverOverlay {
	countdownText: string;
	clicked = new  LiteEvent<void>();
	
	constructor(private htmlOverlayManager: HtmlOverlayManager, private time: Phaser.Time, private victory: boolean, private countdown: number) {

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
			bottomText: this.countdownText
		}), () => {
			this.clicked.trigger();
		 });
	}
}

export = GameOverOverlay;