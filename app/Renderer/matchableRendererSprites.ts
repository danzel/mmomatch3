import Color = require('../Simulation/color');
import Type = require('../Simulation/type');

class MatchableRendererSprites {
	private spriteKeys = new Array<string>();
	private sprites: Array<Array<Phaser.Image>> = [];
	private spriteIndexes: Array<number> = [];

	private overlayIndex = 0;
	private overlaySprites = new Array<Phaser.Image>();

	constructor(private group: Phaser.SpriteBatch, private overlayGroup: Phaser.Group, currentSkin: string) {
		this.changeSkin(currentSkin);
	}

	changeSkin(currentSkin: string) {
		this.sprites.forEach(sa => sa.forEach(s => s.destroy()));

		this.spriteKeys.length = 0;
		this.sprites.length = 0;
		this.spriteIndexes.length = 0;

		for (let i = 0; i < Color.Max; i++) {
			this.spriteKeys.push(currentSkin +'/balls/' + (i + 1) + ".png")
		}
		this.spriteKeys.push(currentSkin + "/balls/gettobottom.png");
		this.spriteKeys.push(currentSkin + "/balls/gettobottomrace1.png");
		this.spriteKeys.push(currentSkin + "/balls/gettobottomrace2.png");
		this.spriteKeys.push(currentSkin + '/balls/colorclear.png');
		this.spriteKeys.push(currentSkin + "/balls/grow.png");

		for (let i = 0; i < this.spriteKeys.length; i++) {
			this.sprites.push([]);
			this.spriteIndexes.push(0);
		}
	}

	begin(): void {
		for (let i = 0; i < this.spriteIndexes.length; i++) {
			this.spriteIndexes[i] = 0;
		}

		this.overlayIndex = 0;
	}

	end(): void {
		for (let k = 0; k < this.spriteIndexes.length; k++) {
			let sprites = this.sprites[k];
			for (let i = this.spriteIndexes[k]; i < sprites.length; i++) {
				sprites[i].visible = false;
			}
		}

		let overlaySprites = this.overlaySprites;
		for (let i = this.overlayIndex; i < overlaySprites.length; i++) {
			overlaySprites[i].visible = false;
		}
	}

	getSprite(color: Color, type: Type): Phaser.Image {
		let index = this.getIndex(color, type);

		let sprites = this.sprites[index];
		let spriteIndex = this.spriteIndexes[index];

		if (!sprites) {
			throw new Error("Invalid getSprite " + color + ", " + type);
		}

		let sprite: Phaser.Image;
		if (spriteIndex == sprites.length) {
			sprite = this.group.game.add.image(0, 0, 'atlas', this.spriteKeys[index], this.group);

			sprite.anchor = new Phaser.Point(0.5, 0.5);
			sprites.push(sprite);
		} else {
			sprite = sprites[spriteIndex];

			sprite.visible = true;
			sprite.scale.x = 1;
			sprite.scale.y = 1;
		}
		this.spriteIndexes[index]++;

		return sprite;
	}

	getIndex(color: Color, type: Type): number {
		if (type == Type.GetToBottom) {
			return Color.Max;
		}
		if (type == Type.GetToBottomRace1) {
			return Color.Max + 1;
		}
		if (type == Type.GetToBottomRace2) {
			return Color.Max + 2;
		}
		if (type == Type.ColorClearWhenSwapped) {
			return Color.Max + 3;
		}
		if (type == Type.GrowOverGrid) {
			return Color.Max + 4;
		}
		return color;
	}

	getOverlaySprite(): Phaser.Image {
		let sprite: Phaser.Image;
		if (this.overlayIndex == this.overlaySprites.length) {
			sprite = this.group.game.add.image(0, 0, 'atlas', null, this.overlayGroup);

			sprite.anchor = new Phaser.Point(0.5, 0.5);
			this.overlaySprites.push(sprite);
		} else {
			sprite = this.overlaySprites[this.overlayIndex];

			sprite.visible = true;
			sprite.scale.x = 1;
			sprite.scale.y = 1;
		}
		this.overlayIndex++;

		return sprite;

	}
};

export = MatchableRendererSprites;