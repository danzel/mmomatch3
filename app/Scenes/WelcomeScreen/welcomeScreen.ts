import HtmlOverlayManager = require('../../HtmlOverlay/manager');

declare function require(filename: string): (data: {}) => string;
require('./welcomeScreen.css');

class WelcomeScreen {
	private element: HTMLElement;
	private nickname: HTMLInputElement;
	private hidenames: HTMLInputElement;

	onLogin: (nickname: string, hideNames: boolean) => void;

	constructor(private htmlOverlayManager: HtmlOverlayManager) {
		this.element = document.getElementById('welcome');
	}

	show() {
		(<HTMLInputElement>document.getElementById('play-button')).value = "Play";
		this.addEventListeners();
	}

	private addEventListeners() {
		
		this.nickname = <HTMLInputElement>this.element.getElementsByClassName('nickname')[0];
		this.hidenames = <HTMLInputElement>this.element.getElementsByClassName('hidenames')[0];

		let form = <HTMLFormElement>document.getElementById('login-form');
		let button = <HTMLInputElement>this.element.getElementsByClassName('button')[0];

		let buttonAction = (ev: Event) => {
			this.element.style.display = 'none';
			this.onLogin(this.nickname.value, this.hidenames.checked);

			ev.preventDefault();
			return false;
		};
		form.addEventListener('submit', buttonAction);
		button.addEventListener('click', buttonAction)
	}
}

export = WelcomeScreen;