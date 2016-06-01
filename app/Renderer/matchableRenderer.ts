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
	
	private static typeHasOverlay(type: Type): boolean {
		return type == Type.VerticalClearWhenMatched || type == Type.HorizontalClearWhenMatched || type == Type.AreaClear3x3WhenMatched;
	}
	render(matchable: Matchable, swap: Swap): void {
		let sprite = this.getSprite();
		
		sprite.frameName = MatchableRenderer.getSpriteFrame(matchable.color, matchable.type);
		
		sprite.x = matchable.x * MatchableRenderer.PositionScalar + xOffset;
		sprite.y = - matchable.y * MatchableRenderer.PositionScalar - yOffset;
		if (swap) {
			this.updatePositionForSwap(matchable, sprite, swap);
		}

		if (matchable.transformTo && matchable.transformTo != Type.ColorClearWhenSwapped) {
			sprite.alpha = 1;
		} else {
			sprite.alpha = 1 - matchable.disappearingPercent;
		}
		

		//TODO: GetToBottom scaling
		/*
		if (matchable.type == Type.GetToBottom) {
			this.sprite.scale.set(0.9, 0.9);
			parent.game.add.tween(this.sprite.scale)
				.to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
				.start();
		}*/
		if (MatchableRenderer.typeHasOverlay(matchable.type)) {
			this.renderOverlay(matchable, matchable.type, sprite, 1);
		} else if (matchable.transformTo) {
			if (MatchableRenderer.typeHasOverlay(matchable.transformTo)) {
				this.renderOverlay(matchable, matchable.transformTo, sprite, matchable.disappearingPercent);
			} else 	if (matchable.transformTo == Type.ColorClearWhenSwapped) {
				let overlay = this.getSprite();
				overlay.frameName = 'balls/colorclear.png';
				overlay.position.x = sprite.position.x;
				overlay.position.y = sprite.position.y;
				overlay.alpha = 1 - sprite.alpha;
			}
		}
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

	private renderOverlay(matchable: Matchable, type: Type, sprite: Phaser.Image, alpha: number) {

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
				throw new Error("Don't know how to renderOverlay for type " + Type[type])
		}

		let overlay = this.getSprite();
		overlay.frameName = frame;
		overlay.position.x = sprite.position.x;
		overlay.position.y = sprite.position.y;
		overlay.alpha = alpha;

		//TODO: Scale it in
		//child.game.add.tween(child.scale)
		//	.to({ x: 0.95, y: 0.95 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
	}
}

export = MatchableRenderer;