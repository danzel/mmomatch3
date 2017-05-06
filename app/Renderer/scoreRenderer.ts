import Language = require('../Language');
import ScoreTracker = require('../Simulation/Scoring/scoreTracker');

class ScoreRenderer {

	fontSize = 16;

	headerTextStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: this.fontSize + 8,
		strokeThickness: 6
	};
	textStyle = <Phaser.PhaserTextStyle>{
		fill: 'white',
		font: 'Chewy',
		fontSize: this.fontSize,
		strokeThickness: 4
	};
	defaultFill = 'white';
	myScoreFill = 'yellow';

	scoreGroup: Phaser.Group;
	scoreText: Array<Phaser.Text> = [];
	title: Phaser.Text;

	height: number;

	constructor(private group: Phaser.Group, private scoreTracker: ScoreTracker, private playerId: number, private playerNames: {[id: number]: string}) {
		this.group.visible = false;
		this.title = new Phaser.Text(this.group.game, 2, 4, scoreTracker.headingText, this.headerTextStyle);
		this.group.add(this.title);

		this.scoreGroup = new Phaser.Group(group.game, group);

		for (let i = 0; i < 6; i++) {
			//Copy'ish' the object, if we had ES6 we could Object.assign
			// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
			let textStyle = Object.create(this.textStyle);

			let text = new Phaser.Text(this.scoreGroup.game, 2, 4 + 10 + (this.fontSize + 2) * (i + 1), "", textStyle);
			this.scoreGroup.add(text);
			this.scoreText.push(text);
		}

		this.height = 2 + (this.fontSize + 2) * (6 + 1 + 1);
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
		let playerPosition = -1;
		if (array.length > 6) {
			isInFirst6 = false;
			for (let i = 0; i < array.length; i++) {
				if (array[i].playerId == this.playerId) {
					playerPosition = i;
					isInFirst6 = i < 6;
					break;
				}
			}
		}

		for (let i = 0; i < Math.min(6, array.length); i++) {
			let val = array[i];

			let text = this.scoreText[i];
			let fill = (this.playerId == val.playerId) ? this.myScoreFill : this.defaultFill;
			var spaces = i == 0 ? ".  " : ". ";
			
			if (!isInFirst6 && i == 4) {
				text.text = "...";
			} else if (!isInFirst6 && i == 5) {
				text.text = (playerPosition + 1) + ". " + this.nameOf(this.playerId) + ": " + (this.scoreTracker.points[this.playerId] || 0);
				fill = this.myScoreFill;
			} else {
				text.text = (i + 1) + spaces + this.nameOf(val.playerId)  + ": " + val.points;
			}
			text.fill = fill;
		}
	}
	
	private nameOf(playerId: number) {
		if (this.playerNames[playerId]) {
			return this.playerNames[playerId];
		}
		//return "Player " + playerId;
		if (playerId == this.playerId) {
			return Language.t('you');
		}
		return Language.t('anonymous');
	}
}

export = ScoreRenderer;