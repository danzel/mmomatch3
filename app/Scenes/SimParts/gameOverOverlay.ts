
class GameOverOverlay {
	gfx: Phaser.Graphics;
	countdownText: Phaser.Text;

	constructor(private group: Phaser.Group, private victory: boolean, private countdown: number) {
		this.addBackground();

		group.add(new Phaser.Text(group.game, 100, 50, victory ? "You won yay!" : "Failure :(", { fill: 'white' }));

		if (countdown) {
			this.countdownText = new Phaser.Text(group.game, 100, 100, "??? in ???", { fill: 'white' })
			group.add(this.countdownText);
			this.update(); // I think? Maybe not needed
		} else {
			group.add(new Phaser.Text(group.game, 100, 100, "Click to continue", { fill: 'white' }));
		}
	}

	private addBackground() {
		this.gfx = new Phaser.Graphics(this.group.game);
		this.gfx.beginFill(0, 0.4);
		this.gfx.drawRect(0, 0, 1, 1);
		this.gfx.endFill();
		this.gfx.scale.set(this.group.game.width, this.group.game.height);

		this.group.add(this.gfx);
	}

	update() {
		if (this.group == null) {
			return;
		}

		if (this.countdown) {
			this.countdown = Math.max(0, this.countdown - this.group.game.time.physicsElapsed);
			this.countdownText.text = (this.victory ? "Next Level in " : "Restarting in ") + this.countdown.toFixed(1) + " seconds";
		}

		this.gfx.scale.set(this.group.game.width, this.group.game.height);
	}
}

export = GameOverOverlay;