import MagicNumbers = require('../../Simulation/magicNumbers');
import MatchableRenderer = require('../../Renderer/matchableRenderer');

class EmoteRenderer {
	group: Phaser.Group;

	constructor(parentGroup: Phaser.Group) {
		this.group = parentGroup.game.add.group(parentGroup);
	}

	showEmote(emoteNumber: number, gridX: number, gridY: number) {
		gridX += 0.5;
		gridY += 0.5 * MagicNumbers.matchableYScale;

		let sprite = this.group.game.add.sprite(gridX * MatchableRenderer.PositionScalar, -gridY / MagicNumbers.matchableYScale * MatchableRenderer.PositionScalar, 'atlas', 'emotes/' + emoteNumber + '.png', this.group);
		sprite.anchor.set(0.5);

		sprite.scale.set(0);

		let tweens = new Array<Phaser.Tween>();
		switch (emoteNumber) {
			case 1:	//glasses
			case 2:	//heart eyes
			case 3:	//toungy
			case 4:	//Cry
			case 6:	//angry
				tweens.push(
					this.group.game.add.tween(sprite.scale)
						.to({ x: 1.3, y: 1.3 }, 300, Phaser.Easing.Linear.None),
					this.group.game.add.tween(sprite.scale)
						.to({ x: 1, y: 1 }, 100, Phaser.Easing.Linear.None),
					this.group.game.add.tween(sprite)
						.to({ angle: 30 }, 1000, (percent: number) => {
							return Math.sin(percent * Math.PI * 4);
						}),
					this.group.game.add.tween(sprite)
						.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None)
				);
				break;
			case 5:	//think
				tweens.push(
					this.group.game.add.tween(sprite.scale)
						.to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.None),
					this.group.game.add.tween(sprite.scale)
						.to({ x: 1.5, y: 1.5 }, 1500, (percent: number) => {
							return 0.4 * Math.sin(percent * Math.PI * 3);
						}),
					this.group.game.add.tween(sprite)
						.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None)
				);
				break;
		}
		for (let i = 0; i < tweens.length - 1; i++) {
			tweens[i].chain(tweens[i+1]);
		}
		tweens[0].start();
		tweens[tweens.length - 1].onComplete.add(() => {
			sprite.destroy();
			console.log('done');
		});
	}
}

export = EmoteRenderer;