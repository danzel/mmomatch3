import Color = require('../Simulation/color');
import Matchable = require('../Simulation/matchable');
import Swap = require('../Simulation/swap');
import Type = require('../Simulation/type');

const positionScalar = 100;
const xOffset = positionScalar / 2;
const yOffset = positionScalar / 2;

class MatchableRenderer {
	public static PositionScalar = positionScalar;
	
	private sprites = new Array<Phaser.Image>();
	private spriteIndex = 0;

	constructor(private group : Phaser.SpriteBatch) {
	}
	
	begin(): void {
		this.spriteIndex = 0;
	}
	
	end(): void {
		for (let i = this.spriteIndex; i < this.sprites.length; i++) {
			this.sprites[i].renderable = false;
		}
	}
	
	private getSprite(): Phaser.Image {
		let sprite: Phaser.Image;
		if (this.spriteIndex == this.sprites.length) {
			sprite = this.group.game.add.image(0, 0, 'atlas', null, this.group);
			
			sprite.anchor = new Phaser.Point(0.5, 0.5);
			this.sprites.push(sprite);
		} else {
			sprite = this.sprites[this.spriteIndex];
			sprite.renderable = true;
			this.spriteIndex++;
		}
		
		return sprite;
	}
	
	render(matchable: Matchable, swap: Swap): void {
		let sprite = this.getSprite();
		
		sprite.frameName = MatchableRenderer.getSpriteFrame(matchable.color, matchable.type);
		
		sprite.x = matchable.x * MatchableRenderer.PositionScalar + xOffset;
		sprite.y = - matchable.y * MatchableRenderer.PositionScalar - yOffset;

		sprite.alpha = 1 - matchable.disappearingPercent;
		
		if (swap) {
			this.updatePositionForSwap(matchable, sprite, swap);
		}

		//TODO: GetToBottom scaling
		/*
		if (matchable.type == Type.GetToBottom) {
			this.sprite.scale.set(0.9, 0.9);
			parent.game.add.tween(this.sprite.scale)
				.to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
				.start();
		}*/
		/*
		if (matchable.type == Type.VerticalClearWhenMatched || matchable.type == Type.HorizontalClearWhenMatched || matchable.type == Type.AreaClear3x3WhenMatched) {
			this.addOverlay(matchable.type);
		} else if (matchable.transformTo) {
			this.updateForTransforming();
		}

		if (this.overlay) {
			if (this.matchable.transformTo) {
				this.overlay.alpha = this.matchable.disappearingPercent;
			} else {
				this.overlay.alpha = 1;
			}
		}

		if (!this.matchable.transformTo || this.replacementSprite) {
			this.sprite.alpha = 1 - this.matchable.disappearingPercent;
			if (this.overlay) {
				this.overlay.alpha = this.sprite.alpha;
			}
		}

		if (this.replacementSprite) {
			this.replacementSprite.alpha = 1 - this.sprite.alpha;
			this.replacementSprite.position.x = this.sprite.position.x;
			this.replacementSprite.position.y = this.sprite.position.y;
		}*/
	}

	static getSpriteFrame(color: Color, type: Type): string {
		if (type == Type.GetToBottom) {
			return "balls/gettobottom.png";
		}
		if (type == Type.ColorClearWhenSwapped) {
			return 'balls/colorclear.png';
		}

		return 'balls/' + (color + 1) + ".png";
	}

	private updatePositionForSwap(matchable: Matchable, sprite: Phaser.Image, swap: Swap) {
		let otherMatchable = swap.left == matchable ? swap.right : swap.left;

		var diffX = otherMatchable.x - matchable.x;
		var diffY = otherMatchable.y - matchable.y;

		sprite.position.x += diffX * swap.percent * MatchableRenderer.PositionScalar;
		sprite.position.y -= diffY * swap.percent * MatchableRenderer.PositionScalar;
	}
/*
	updateForTransforming() {
		if (this.matchable.transformTo == Type.ColorClearWhenSwapped) {
			this.replacementSprite = new Phaser.Image(this.sprite.game, 0, 0, 'atlas', 'balls/colorclear.png');
			this.replacementSprite.anchor.set(0.5, 0.5);
			this.sprite.parent.addChild(this.replacementSprite);
		} else {
			this.addOverlay(this.matchable.transformTo);
		}
	}

	private addOverlay(type: Type) {

		let frame: string;
		switch (type) {
			case Type.VerticalClearWhenMatched:
				frame = 'balloverlays/vertical.png';
				break;
			case Type.HorizontalClearWhenMatched:
				frame = 'balloverlays/horizontal.png';
				break;
			case Type.AreaClear3x3WhenMatched:
				frame = 'balloverlays/areaclear.png';
				break;
			default:
				throw new Error("Don't know how to update for transform to type " + Type[this.matchable.transformTo])
		}

		let child = new Phaser.Image(this.sprite.game, 0, 0, 'atlas', frame);
		child.anchor.set(0.5, 0.5);
		this.sprite.parent.addChild(child);
		child.position = this.sprite.position; //HACK - we always want these to be in the same place
		this.overlay = child;

		child.game.add.tween(child.scale)
			.to({ x: 0.95, y: 0.95 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
	}

	updateForTransformed() {
		if (this.replacementSprite) {
			this.sprite.destroy();
			this.sprite = this.replacementSprite;
			delete this.replacementSprite;
		}
	}

	disappear() {
		this.sprite.destroy();
		if (this.overlay) {
			this.overlay.destroy();
		}
	}*/
}

export = MatchableRenderer;