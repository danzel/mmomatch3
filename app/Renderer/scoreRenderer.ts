import TickPoints = require('../DataPackets/tickPoints');

class ScoreRenderer {
	textStyle = {
		fill: 'white',
		fontSize: 16
	};
	myScoreTextStyle = {
		fill: 'yellow',
		fontSize: 16
	};

	scoreGroup: Phaser.Group;
	title: Phaser.Text;
	
	background: Phaser.Graphics;
	backgroundHeight: number;
	backgroundWidth: number;
	
	playerId: number;

	constructor(private group: Phaser.Group) {

		this.background = new Phaser.Graphics(this.group.game);
		this.background.beginFill(0x000000, 0.5);
		this.background.drawRect(0, 0, 1, 1);
		this.background.endFill();

		group.add(this.background);
		this.title = new Phaser.Text(this.group.game, 2, 2, "Scores", this.textStyle);
		this.group.add(this.title);
		
		this.scoreGroup = new Phaser.Group(group. game, group);
	}
	
	notifyPlayerId(playerId: number) {
		this.playerId = playerId;
	}

	updateData(data: Array<TickPoints>) {
		//Can probably do this more efficiently by reusing existing text objects?
		
		this.scoreGroup.removeAll();

		let maxWidth = this.title.width;

		for (let i = 0; i < data.length; i++) {
			let val = data[i];

			let style = (this.playerId == val.playerId) ? this.myScoreTextStyle : this.textStyle;
			let text = new Phaser.Text(this.scoreGroup.game, 2, 4 + 16 * (i + 1), val.name + ": " + val.points, style);
			this.scoreGroup.add(text);
			maxWidth = Math.max(text.width, maxWidth);
		}

		let backgroundWidth = maxWidth + 4;
		let backgroundHeight = (data.length + 1) * 16 + 8;

		if (this.backgroundWidth != backgroundWidth || this.backgroundHeight != backgroundHeight) {
			this.background.scale.x = backgroundWidth;
			this.background.scale.y = backgroundHeight;

			this.backgroundWidth = backgroundWidth;
			this.backgroundHeight = backgroundHeight;
		}
	}
}

export = ScoreRenderer;