import ScoreTracker = require('../Simulation/Scoring/scoreTracker');

class ScoreRenderer {
	
	fontSize = 22;
	
	textStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: this.fontSize
	};
	myScoreTextStyle = <Phaser.PhaserTextStyle>{
		fill: 'yellow',
		font: 'Chewy',
		fontSize: this.fontSize
	};

	scoreGroup: Phaser.Group;
	scoreText: Array<Phaser.Text> = [];
	title: Phaser.Text;

	background: Phaser.Graphics;
	backgroundHeight: number;
	backgroundWidth: number;

	constructor(private group: Phaser.Group, private scoreTracker: ScoreTracker, private playerId: number) {

		this.background = new Phaser.Graphics(this.group.game);
		this.background.beginFill(0x000000, 0.5);
		this.background.drawRect(0, 0, 1, 1);
		this.background.endFill();

		group.add(this.background);
		this.title = new Phaser.Text(this.group.game, 2, 2, "Scores", this.textStyle);
		this.group.add(this.title);

		this.scoreGroup = new Phaser.Group(group.game, group);

		for (let i = 0; i < 3; i++) {
			let text = new Phaser.Text(this.scoreGroup.game, 2, 4 + this.fontSize * (i + 1), "");
			this.scoreGroup.add(text);
			this.scoreText.push(text);
		}
	}

	updateData() {
		let array = new Array<{ playerId: number, points: number }>();
		for (let playerId in this.scoreTracker.points) {
			array.push({ playerId: parseInt(playerId), points: this.scoreTracker.points[playerId] });
		}
		array.sort((a, b) => {
			return b.points - a.points;
		})

		let maxWidth = this.title.width;

		for (let i = 0; i < Math.min(3, array.length); i++) {
			let val = array[i];

			let text = this.scoreText[i];
			let style = (this.playerId == val.playerId) ? this.myScoreTextStyle : this.textStyle;
			text.setStyle(style)
			text.text = "Player " + val.playerId + ": " + val.points; //TODO: Player Name
			maxWidth = Math.max(text.width, maxWidth);
		}

		let backgroundWidth = maxWidth + 4;
		let backgroundHeight = (Math.min(3, array.length) + 1) * this.fontSize + 8;

		if (this.backgroundWidth != backgroundWidth || this.backgroundHeight != backgroundHeight) {
			this.background.scale.x = backgroundWidth;
			this.background.scale.y = backgroundHeight;

			this.backgroundWidth = backgroundWidth;
			this.backgroundHeight = backgroundHeight;
		}
	}
}

export = ScoreRenderer;