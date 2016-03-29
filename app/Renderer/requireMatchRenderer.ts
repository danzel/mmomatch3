import MatchableNode = require('./matchableNode');
import RequireMatch = require('../Simulation/requireMatch');
import Simulation = require('../Simulation/simulation');

class RequireSprite {
	sprite: Phaser.Sprite;
	constructor(parentGroup: Phaser.Group, public req: RequireMatch) {
		this.sprite = parentGroup.game.add.sprite(req.x * MatchableNode.PositionScalar, -(1 + req.y) * MatchableNode.PositionScalar, 'requirematch', null, parentGroup);
	}
}

class RequireMatchRenderer {
	group: Phaser.Group;
	requireSprites = new Array<RequireSprite>();

	constructor(simulation: Simulation, simulationGroup: Phaser.Group) {
		//We are a child of simGroup so we get the scaling and stuff
		this.group = simulationGroup.game.add.group(simulationGroup);

		simulation.requireMatchInCellTracker.requirements.forEach((req) => {
			this.requireSprites.push(new RequireSprite(this.group, req));
		});

		simulation.requireMatchInCellTracker.requirementPartiallyMet.on((req) => this.requirementPartiallyMet(req))
		simulation.requireMatchInCellTracker.requirementMet.on((req) => this.requirementMet(req))
	}

	private requirementPartiallyMet(req: RequireMatch) {
		//TODO
		throw new Error("RequireMatchRenderer for amount > 1 isn't implemented")
	}
	private requirementMet(req: RequireMatch) {
		for (let i = 0; i < this.requireSprites.length; i++) {
			let spr = this.requireSprites[i];
			if (spr.req == req) {
				spr.sprite.destroy();
				this.requireSprites.splice(i, 1);
				break;
			}

		}
	}
}

export = RequireMatchRenderer;