class PlayerCountRenderer {
	textStyle: Phaser.PhaserTextStyle = {
		font: 'Chewy',
		fontSize: 22,
		fill: 'white',
		strokeThickness: 4,
		
		boundsAlignH: 'right'
	};

	background: Phaser.Graphics;
	text: Phaser.Text;

	constructor(private group: Phaser.Group) {
		this.text = new Phaser.Text(this.group.game, -4, 4, "Players: ?", this.textStyle);
		this.text.setTextBounds(0, 0, 0, 0);
		this.group.add(this.text);
	}
	
	updateData(playerCount: number) {
		this.text.text = "Players: " + playerCount;
		
		this.group.position.x = this.group.game.width - 4;
	}
}

export = PlayerCountRenderer;