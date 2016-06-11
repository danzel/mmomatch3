import Color = require('../Simulation/color');
import Type = require('../Simulation/type');

class MatchableRendererSprites {
	private spriteKeys = new Array<string>();
	private sprites: Array<Array<Phaser.Image>> = [];
	private spriteIndexes: Array<number> = [];

	constructor(private group: Phaser.SpriteBatch) {
		for (let i = 0; i < Color.Max; i++) {
			this.spriteKeys.push('balls/' + (i + 1) + ".png")
		}
		this.spriteKeys.push("balls/gettobottom.png");
		this.spriteKeys.push('balls/colorclear.png');

		for (let i = 0; i < this.spriteKeys.length; i++) {
			this.sprites.push([]);
			this.spriteIndexes.push(0);
		}
	}

	begin(): void {
		//this.spriteIndex = 0;
		for (var i = 0; i < this.spriteIndexes.length; i++) {
			this.spriteIndexes[i] = 0;
		}
		//this.loops = 0;
	}

	end(): void {
		for (var k = 0; k < this.spriteIndexes.length; k++) {
			let sprites = this.sprites[k];
			for (let i = this.spriteIndexes[k]; i < sprites.length; i++) {
				sprites[i].visible = false;
			}
		}
	}

	getSprite(color: Color, type: Type): Phaser.Image {
		let index = this.getIndex(color, type);

		let sprites = this.sprites[index];
		let spriteIndex = this.spriteIndexes[index];

		let sprite: Phaser.Image;
		if (spriteIndex == sprites.length) {
			sprite = this.group.game.add.image(0, 0, 'atlas', this.spriteKeys[index], this.group);

			sprite.anchor = new Phaser.Point(0.5, 0.5);
			sprites.push(sprite);
		} else {
			sprite = sprites[spriteIndex];
			this.spriteIndexes[index]++;

			sprite.visible = true;
			sprite.scale.x = 1;
			sprite.scale.y = 1;
		}

		return sprite;
	}

	getIndex(color: Color, type: Type): number {
		if (type == Type.GetToBottom) {
			return Color.Max;
		}
		if (type == Type.ColorClearWhenSwapped) {
			return Color.Max + 1;
		}
		return color;
	}
};

export = MatchableRendererSprites;