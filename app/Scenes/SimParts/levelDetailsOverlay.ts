import LevelDef = require('../../Simulation/Levels/levelDef');
import LimitType = require('../../Simulation/Levels/limitType');
import TouchCatchAll = require('../../Renderer/Components/touchCatchAll');
import VictoryType = require('../../Simulation/Levels/victoryType');

class LevelDetailsOverlay {
	gfx: Phaser.Graphics;
	
	closed = false;
	
	constructor(private group: Phaser.Group, private level: LevelDef) {
		
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
		this.group.add(new Phaser.Text(this.group.game, 50, 50, "Level " + this.level.levelNumber, {
			fill: 'white'
		}));

		this.group.add(new Phaser.Text(this.group.game, 50, 90, "Size: " + this.level.width + " x " + this.level.height, {
			fill: 'white'
		}));
		
		this.group.add(new Phaser.Text(this.group.game, 50, 140, this.getVictoryText() + " " + this.getLimitText(), {
			fill: 'white'
		}));
		
		this.group.add(new Phaser.Text(this.group.game, 50, 200, "Click to start", {
			fill: 'white'
		}));
	}
	
	private getVictoryText(): string {
		switch (this.level.victoryType) {
			case VictoryType.Matches:
				return "Match " + this.level.victoryValue + " {Thingies???}"; //TODO: Thingies
			case VictoryType.Points:
				return "Get " + this.level.victoryType + " Points";
			default:
				throw new Error("Don't know about LimitType " + this.level.limitType + " " + LimitType[this.level.limitType]);
		}
	}
	
	private getLimitText(): string {
		switch (this.level.limitType) {
			case LimitType.Swaps:
				return "Within " + this.level.limitValue + " Swaps";
			case LimitType.Time:
				return "Within " + this.level.limitValue + " Seconds";
			default:
				throw new Error("Don't know about LimitType " + this.level.limitType + " " + LimitType[this.level.limitType])
		}
	}
	
	update() {
		if (this.group == null) {
			return;
		}
		
		this.gfx.scale.set(this.group.game.width, this.group.game.height);
	}
}

export = LevelDetailsOverlay;