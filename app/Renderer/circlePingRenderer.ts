import MagicNumbers = require('../Simulation/magicNumbers');
import MatchableRenderer = require('./matchableRenderer');

const currentSkin = 'skin-emojione-animals';

class CirclePingRenderer {
	private circles = new Array<Phaser.Image>();
	private circlesUsed = 0;

	private haveEverRendered = false;
	private startTime = 0;

	constructor(private group: Phaser.Group) {
	}

	show(x: number, y: number) {

		if (!this.haveEverRendered) {
			this.haveEverRendered = true;
			this.startTime = this.group.game.time.now;
		}
		let nowS = (this.group.game.time.now - this.startTime) / 1000;

		x = MatchableRenderer.PositionScalar * x + (MatchableRenderer.PositionScalar) / 2;
		y = -((y / MagicNumbers.matchableYScale) + 0.5) * MatchableRenderer.PositionScalar;

		if (this.circles.length == this.circlesUsed) {
			let hi = this.group.game.add.sprite(0, 0, 'atlas', currentSkin + '/circle.png', this.group);
			hi.anchor.set(0.5);
			this.circles.push(hi);
		}

		let highlighter = this.circles[this.circlesUsed];
		this.circlesUsed++;
		highlighter.visible = true;

		highlighter.position.set(x, y)
		highlighter.scale.set(Phaser.Easing.Cubic.Out((nowS / 3) % 1) * 9);
		highlighter.alpha = 1 - Phaser.Easing.Sinusoidal.In((nowS / 3) % 1);
	}

	begin() {
		this.circlesUsed = 0;
	}

	end() {
		while (this.circlesUsed < this.circles.length) {
			this.circles[this.circlesUsed].visible = false;
			this.circlesUsed++;
		}
	}
}

export = CirclePingRenderer;