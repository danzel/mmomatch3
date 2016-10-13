import HtmlTranslator = require('../../Language/htmlTranslator');

declare function require(filename: string): (data: {}) => string;
require('./welcomeScreen.css');

class WelcomeScreen {
	private element: HTMLElement;
	private nickname: HTMLInputElement;
	private hidenames: HTMLInputElement;

	onLogin: (nickname: string, hideNames: boolean) => void;

	constructor() {
		this.element = document.getElementById('welcome');
	}

	show() {
		let playerIsLoggedIn = window.location.hash.indexOf('success') >= 0;
		window.location.hash = '';

		this.addEventListeners(playerIsLoggedIn);
		HtmlTranslator.showStartButton(playerIsLoggedIn);
	}

	private addEventListeners(playerIsLoggedIn: boolean) {

		this.nickname = <HTMLInputElement>this.element.getElementsByClassName('nickname')[0];
		this.hidenames = <HTMLInputElement>this.element.getElementsByClassName('hidenames')[0];

		let form = <HTMLFormElement>document.getElementById('login-form');
		let button = <HTMLInputElement>document.getElementById('play-button');

		let loginButton = <HTMLInputElement>document.getElementById('login-button');
		let loginContainer = <HTMLInputElement>document.getElementsByClassName('btn-container')[0];

		try {
			if (playerIsLoggedIn && window.localStorage.getItem('nickname')) {
				this.nickname.value = window.localStorage.getItem('nickname');
			}
		} catch (e) {
			//Ignore, some chrome versions fail here
		}

		let buttonAction = (ev: Event) => {
			this.element.style.display = 'none';
			try {
				window.localStorage.setItem('nickname', this.nickname.value);
			} catch (e) {
				//Ignore, Safari in private browsing fails here
			}

			this.onLogin(this.nickname.value, this.hidenames.checked);

			ev.preventDefault();
			return false;
		};
		form.addEventListener('submit', buttonAction);
		button.addEventListener('click', buttonAction);

		if (playerIsLoggedIn) {
			loginButton.addEventListener('click', () => {
				window.location.assign('/logout');
			});
		} else {
			let loginAreaVisible = false;
			loginButton.addEventListener('click', () => {
				loginAreaVisible = !loginAreaVisible;
				loginContainer.style.display = loginAreaVisible ? 'block' : 'none';
			});
		}
	}
}

export = WelcomeScreen;