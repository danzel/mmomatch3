import Color = require('../Simulation/color');
import FailedToSwapState = require('./failedToSwapState');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import MatchableRendererSprites = require('./matchableRendererSprites');
import Swap = require('../Simulation/swap');
import SwapHandler = require('../Simulation/swapHandler');
import Type = require('../Simulation/type');

const positionScalar = 100;
const xOffset = positionScalar / 2;
const yOffset = positionScalar / 2;

class MatchableRenderer {
	public static PositionScalar = positionScalar;
	
	sprites: MatchableRendererSprites;

	constructor(private group : Phaser.SpriteBatch, private failedToSwapState: FailedToSwapState) {
		this.sprites = new MatchableRendererSprites(group);
	}
	
	begin(): void {
		this.sprites.begin();
	}
	
	end(): void {
		this.sprites.end();
	}
	
	
	private static typeHasOverlay(type: Type): boolean {
		return type == Type.VerticalClearWhenMatched || type == Type.HorizontalClearWhenMatched || type == Type.AreaClear3x3WhenMatched;
	}
	render(matchable: Matchable, swap: Swap): void {
		let sprite = this.sprites.getSprite(matchable.color, matchable.type);
		
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
				let overlay = this.sprites.getSprite(Color.None, Type.ColorClearWhenSwapped);
				overlay.position.x = sprite.position.x;
				overlay.position.y = sprite.position.y;
				overlay.alpha = 1 - sprite.alpha;
			}
		}
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
/*
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
		
		
		overlay.scale.set(1 - 0.05 * this.bounce(2000));*/
	}
	
	private bounce(period: number): number {
		let now = (this.group.game.time.now / period) % 1;
		return Phaser.Easing.Sinusoidal.InOut(now > 0.5 ? (1 - (now - 0.5) * 2) : now * 2);
	}
}

export = MatchableRenderer;