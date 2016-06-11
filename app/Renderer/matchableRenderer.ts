import Color = require('../Simulation/color');
import FailedToSwapState = require('./failedToSwapState');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import Swap = require('../Simulation/swap');
import SwapHandler = require('../Simulation/swapHandler');
import Type = require('../Simulation/type');

const positionScalar = 100;
const xOffset = positionScalar / 2;
const yOffset = positionScalar / 2;

class MatchableRenderer {
	public static PositionScalar = positionScalar;
	
	private sprites = new Array<Phaser.Image>();
	private spriteIndex = 0;

	constructor(private group : Phaser.SpriteBatch, private failedToSwapState: FailedToSwapState) {
	}
	
	begin(): void {
		this.spriteIndex = 0;
	}
	
	end(): void {
		for (let i = this.spriteIndex; i < this.sprites.length; i++) {
			this.sprites[i].visible = false;
		}
	}
	
	private getSprite(frameName: string): Phaser.Image {
		let sprite: Phaser.Image;
		if (this.spriteIndex == this.sprites.length) {
			sprite = this.group.game.add.image(0, 0, 'atlas', null, this.group);
			
			sprite.anchor = new Phaser.Point(0.5, 0.5);
			this.sprites.push(sprite);
		} else {
			//Find a sprite with the same frame
			let found = false;
			for (let i = this.spriteIndex; i < this.sprites.length; i++) {
				if (this.sprites[i].animations.frameName == frameName) {
					if (i != this.spriteIndex) {
						let temp = this.sprites[this.spriteIndex];
						this.sprites[this.spriteIndex] = this.sprites[i];
						this.sprites[i] = temp;

						this.group.swapChildren(this.sprites[this.spriteIndex], this.sprites[i])
					}
					found = true;
					break;
				}
			}

			sprite = this.sprites[this.spriteIndex];
			sprite.visible = true;
			sprite.scale.x = 1;
			sprite.scale.y = 1;
			if (!found) {
				sprite.frameName = frameName;
			}
			this.spriteIndex++;
		}
		
		return sprite;
	}
	
	private static typeHasOverlay(type: Type): boolean {
		return type == Type.VerticalClearWhenMatched || type == Type.HorizontalClearWhenMatched || type == Type.AreaClear3x3WhenMatched;
	}
	render(matchable: Matchable, swap: Swap): void {
		let sprite = this.getSprite(MatchableRenderer.getSpriteFrame(matchable.color, matchable.type));
		
		sprite.x = matchable.x * MatchableRenderer.PositionScalar + xOffset;
		sprite.y = - (matchable.y / MagicNumbers.matchableYScale) * MatchableRenderer.PositionScalar - yOffset;
		if (swap) {
			this.updatePositionForSwap(matchable, sprite, swap);
		}
		//TODO: Would be nice if these appeared on top
		let failTransform = this.failedToSwapState.getFailTransform(matchable);
		if (failTransform) {
			sprite.x += failTransform.x;
			sprite.y += failTransform.y;
		}

		if (matchable.transformTo && matchable.transformTo != Type.ColorClearWhenSwapped) {
			sprite.alpha = 1;
		} else {
			sprite.alpha = 1 - matchable.disappearingPercent;
		}
		

		if (matchable.type == Type.GetToBottom) {
			sprite.scale.set(0.9 + 0.2 * Phaser.Easing.Sinusoidal.InOut(this.bounce(1500)));
		}
		
		if (MatchableRenderer.typeHasOverlay(matchable.type)) {
			this.renderOverlay(matchable, matchable.type, sprite, sprite.alpha);
		} else if (matchable.transformTo) {
			if (MatchableRenderer.typeHasOverlay(matchable.transformTo)) {
				this.renderOverlay(matchable, matchable.transformTo, sprite, matchable.disappearingPercent);
			} else 	if (matchable.transformTo == Type.ColorClearWhenSwapped) {
				let overlay = this.getSprite('balls/colorclear.png');
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
		diffY = diffY == 0 ? 0 : diffY / Math.abs(diffY);

		let percent = swap.ticks / SwapHandler.TicksToSwap;
		sprite.position.x += diffX * percent * MatchableRenderer.PositionScalar;
		sprite.position.y -= diffY * percent * MatchableRenderer.PositionScalar;
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

		let overlay = this.getSprite(frame);
		overlay.position.x = sprite.position.x;
		overlay.position.y = sprite.position.y;
		overlay.alpha = alpha;
		
		
		overlay.scale.set(1 - 0.05 * this.bounce(2000));
	}
	
	private bounce(period: number): number {
		let now = (this.group.game.time.now / period) % 1;
		return Phaser.Easing.Sinusoidal.InOut(now > 0.5 ? (1 - (now - 0.5) * 2) : now * 2);
	}
}

export = MatchableRenderer;