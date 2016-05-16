import HtmlOverlayManager = require('../../HtmlOverlay/manager');

declare function require(filename: string): (data: {}) => string;
require('./welcomeScreen.css');

class WelcomeScreen {
	private element: HTMLElement;
	private nickname: HTMLInputElement;
	private button: HTMLInputElement;
	private hidenames: HTMLInputElement;

	onLogin: (nickname: string, hideNames: boolean) => void;

	constructor(private htmlOverlayManager: HtmlOverlayManager) {
		this.element = document.getElementById('welcome');
	}

	show() {
		(<HTMLInputElement>document.getElementById('play-button')).value = "Play";
		HtmlOverlayManager.fixSvgs(this.element);
		this.addEventListeners();
	}

	private addEventListeners() {
		this.nickname = <HTMLInputElement>this.element.getElementsByClassName('nickname')[0];
		this.button = <HTMLInputElement>this.element.getElementsByClassName('button')[0];
		this.hidenames = <HTMLInputElement>this.element.getElementsByClassName('hidenames')[0];

		this.button.addEventListener('click', () => {
			this.element.style.display = 'none';
			this.onLogin(this.nickname.value, this.hidenames.checked);
		})
	}
}

export = WelcomeScreen;