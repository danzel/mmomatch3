import ScoreTracker = require('../../Simulation/Scoring/scoreTracker');

class PointsEarnedDisplay {
	textStyle = {
		font: 'Chewy',
		fontSize: 60,
		fill: 'white',
		strokeThickness: 8,

		boundsAlignH: 'center'
	}

	text: Phaser.Text;
	
	shownPoints = 0;

	constructor(group: Phaser.Group, scoretracker: ScoreTracker, playerId: number) {
		group.visible = false;
		this.text = new Phaser.Text(group.game, group.game.width / 2, 40, "", this.textStyle);
		group.add(this.text);
		this.text.setTextBounds(0, 0, 0, 0)

		scoretracker.playerEarnedPoints.on(data => {
			if (data.playerId == playerId) {
				this.showPoints(data.points);
			}
		})
	}

	private showPoints(points: number) {
		//While the points are visible add to them, otherwise reset to 0
		if (this.text.alpha == 0) {
			this.shownPoints = 0;
		}
		this.shownPoints += points;
		
		this.text.text = '' + this.shownPoints;

		this.text.game.tweens.removeFrom(this.text);
		
		this.text.alpha = 1;
		this.text.scale.set(1); //TODO: Should probably vary size based on amount of points
		
		this.text.game.add.tween(this.text)
			.to({ alpha: 0 }, 1000, Phaser.Easing.power2, true);
		this.text.game.add.tween(this.text.scale)
			.to({ x: 0.5, y: 0.5 }, 1000, Phaser.Easing.power2, true);
	}

	updatePosition() {
		this.text.x = Math.floor(this.text.game.width / 2);
	}
}

export = PointsEarnedDisplay;