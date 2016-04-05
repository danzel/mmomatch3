import Detector = require('../../Simulation/Levels/detector');
import LevelDef = require('../../Simulation/Levels/levelDef');
import LiteEvent = require('../../liteEvent');
import TouchCatchAll = require('../../Renderer/Components/touchCatchAll');

class LevelDetailsOverlay {

	headStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: 70,
		strokeThickness: 8,
		boundsAlignH: "center",
		boundsAlignV: "top"
	}
	smallTextStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: 22,
		strokeThickness: 4,
		boundsAlignH: "center",
		boundsAlignV: "middle"
	}
	mediumTextStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: 28,
		strokeThickness: 6,
		boundsAlignH: "center",
		boundsAlignV: "middle"
	}

	gfx: Phaser.Graphics;

	closed = false;

	becameClosed = new LiteEvent<void>();

	width = 480;
	height = 270;

	constructor(private group: Phaser.Group, private level: LevelDef, private victoryDetector: Detector, private failureDetector: Detector) {

		this.addTouchCatchAll();
		this.addBackground();
		this.addDetails();
		this.update();
	}

	private addTouchCatchAll() {
		let touchCatchAll = new TouchCatchAll(this.group.game);
		this.group.add(touchCatchAll.sprite);

		touchCatchAll.pointerUp.on((data) => {
			console.log('up?', data);
			this.closed = true;
			this.group.destroy();
			this.group = null;

			this.becameClosed.trigger();
		})
	}

	private addBackground() {
		this.gfx = new Phaser.Graphics(this.group.game);
		this.gfx.beginFill(0x8FB863, 1);
		this.gfx.lineStyle(5, 0x6382B8);
		this.gfx.drawRoundedRect(0, 0, this.width, this.height, 20);
		this.gfx.endFill();

		this.group.add(this.gfx);
	}

	private addDetails() {
		this.group.add(new Phaser.Text(this.group.game, this.width / 2, 0, "Level " + this.level.levelNumber, this.headStyle).setTextBounds(0, 0, 0, 0));

		this.group.add(new Phaser.Text(this.group.game, this.width / 2, 100, "Size: " + this.level.width + " x " + this.level.height, this.smallTextStyle).setTextBounds(0, 0, 0, 0));

		this.group.add(new Phaser.Text(this.group.game, this.width / 2, 160, this.getVictoryText(), this.mediumTextStyle).setTextBounds(0, 0, 0, 0));
		this.group.add(new Phaser.Text(this.group.game, this.width / 2, 190, this.getFailureText(), this.mediumTextStyle).setTextBounds(0, 0, 0, 0));

		this.group.add(new Phaser.Text(this.group.game, this.width / 2, 250, "Click to start", this.smallTextStyle).setTextBounds(0, 0, 0, 0));
	}

	private getVictoryText(): string {
		return this.victoryDetector.getDetailsText();
	}

	private getFailureText(): string {
		return this.failureDetector.getDetailsText();
	}

	update() {
		if (this.group == null) {
			return;
		}

		this.group.position.set((this.group.game.width - this.width) / 2, 50);
	}
}

export = LevelDetailsOverlay;