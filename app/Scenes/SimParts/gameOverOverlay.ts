
class GameOverOverlay {
	gfx: Phaser.Graphics;
	countdownText: Phaser.Text;

	headStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: 70,
		strokeThickness: 8,
		boundsAlignH: "center",
		boundsAlignV: "top"
	}
	footStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: 22,
		strokeThickness: 4,
		boundsAlignH: "center",
		boundsAlignV: "middle"
	}

	width = 480;
	height = 200;

	constructor(private group: Phaser.Group, private victory: boolean, private countdown: number) {
		this.addBackground();

		group.add(new Phaser.Text(group.game, this.width / 2, 10, victory ? "You won yay!" : "Failure :(", this.headStyle).setTextBounds(0, 0, 0, 0));

		if (countdown) {
			this.countdownText = new Phaser.Text(group.game, this.width / 2, 140, "??? in ???", this.footStyle).setTextBounds(0, 0, 0, 0);
			group.add(this.countdownText);
		} else {
			group.add(new Phaser.Text(group.game, this.width / 2, 180, "Click to continue", this.footStyle).setTextBounds(0, 0, 0, 0));
		}
		this.update();
	}

	private addBackground() {
		this.gfx = new Phaser.Graphics(this.group.game);
		this.gfx.beginFill(0x8FB863, 1);
		this.gfx.lineStyle(5, 0x6382B8);
		this.gfx.drawRoundedRect(0, 0, this.width, this.height, 20);
		this.gfx.endFill();

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

		this.group.position.set((this.group.game.width - this.width) / 2, 50);
	}
}

export = GameOverOverlay;