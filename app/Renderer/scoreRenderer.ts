import ScoreTracker = require('../Simulation/Scoring/scoreTracker');

class ScoreRenderer {

	fontSize = 22;

	headerTextStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: this.fontSize + 10,
		strokeThickness: 8
	};
	textStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: this.fontSize,
		strokeThickness: 6
	};
	myScoreTextStyle = <Phaser.PhaserTextStyle>{
		fill: 'yellow',
		font: 'Chewy',
		fontSize: this.fontSize,
		strokeThickness: 6
	};

	scoreGroup: Phaser.Group;
	scoreText: Array<Phaser.Text> = [];
	title: Phaser.Text;

	height: number;

	constructor(private group: Phaser.Group, private scoreTracker: ScoreTracker, private playerId: number) {

		this.title = new Phaser.Text(this.group.game, 2, 2, "Scores", this.headerTextStyle);
		this.group.add(this.title);

		this.scoreGroup = new Phaser.Group(group.game, group);

		for (let i = 0; i < 6; i++) {
			let text = new Phaser.Text(this.scoreGroup.game, 2, 4 + 10 + this.fontSize * (i + 1), "", this.textStyle);
			this.scoreGroup.add(text);
			this.scoreText.push(text);
		}

		this.height = 5 + this.fontSize * (6 + 1 + 1);
	}

	updateData() {
		this.group.position.set(5, this.scoreGroup.game.height - this.height);

		let array = new Array<{ playerId: number, points: number }>();
		for (let playerId in this.scoreTracker.points) {
			array.push({ playerId: parseInt(playerId), points: this.scoreTracker.points[playerId] });
		}
		if (this.scoreTracker.points[this.playerId] === undefined) {
			array.push({ playerId: this.playerId, points: 0 });
		}
		array.sort((a, b) => {
			return b.points - a.points;
		});
		
		//If player is not in the first 6, change 5 to "..." and make 6 the player
		let isInFirst6 = true;
		if (array.length > 6) {
			isInFirst6 = false;
			for (let i = 0; i < 6; i++) {
				if (array[i].playerId == this.playerId) {
					isInFirst6 = true;
					break;
				}
			}
		}

		for (let i = 0; i < Math.min(6, array.length); i++) {
			let val = array[i];

			let text = this.scoreText[i];
			let style = (this.playerId == val.playerId) ? this.myScoreTextStyle : this.textStyle;
			text.setStyle(style)
			text.text = "Player " + val.playerId + ": " + val.points; //TODO: Player Name
			
			if (!isInFirst6 && i == 4) {
				text.text = "...";
			}
			if (!isInFirst6 && i == 5) {
				text.setStyle(this.myScoreTextStyle);
				
				text.text = "Player " + this.playerId + ": " + (this.scoreTracker.points[this.playerId] || 0);
			}
		}
	}
}

export = ScoreRenderer;