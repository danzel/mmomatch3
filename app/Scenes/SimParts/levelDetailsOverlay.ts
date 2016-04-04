import Detector = require('../../Simulation/Levels/detector');
import LevelDef = require('../../Simulation/Levels/levelDef');
import TouchCatchAll = require('../../Renderer/Components/touchCatchAll');

class LevelDetailsOverlay {
	textStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: 22
	}

	gfx: Phaser.Graphics;

	closed = false;

	constructor(private group: Phaser.Group, private level: LevelDef, private victoryDetector: Detector, private failureDetector: Detector) {

		this.addTouchCatchAll();
		this.addBackground();
		this.addDetails();
	}

	private addTouchCatchAll() {
		let touchCatchAll = new TouchCatchAll(this.group.game);
		this.group.add(touchCatchAll.sprite);

		touchCatchAll.pointerUp.on((data) => {
			console.log('up?', data);
			this.closed = true;
			this.group.destroy();
			this.group = null;
		})
	}

	private addBackground() {
		this.gfx = new Phaser.Graphics(this.group.game);
		this.gfx.beginFill(0, 0.4);
		this.gfx.drawRect(0, 0, 1, 1);
		this.gfx.endFill();
		this.gfx.scale.set(this.group.game.width, this.group.game.height);

		this.group.add(this.gfx);
	}

	private addDetails() {
		this.group.add(new Phaser.Text(this.group.game, 50, 50, "Level " + this.level.levelNumber, this.textStyle));

		this.group.add(new Phaser.Text(this.group.game, 50, 90, "Size: " + this.level.width + " x " + this.level.height, this.textStyle));

		this.group.add(new Phaser.Text(this.group.game, 50, 140, this.getVictoryText() + " " + this.getFailureText(), this.textStyle));

		this.group.add(new Phaser.Text(this.group.game, 50, 200, "Click to start", this.textStyle));
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

		this.gfx.scale.set(this.group.game.width, this.group.game.height);
	}
}

export = LevelDetailsOverlay;