import HtmlTranslator = require('../../Language/htmlTranslator');

declare function require(filename: string): (data: {}) => string;
require('./welcomeScreen.css');

class WelcomeScreen {
	private element: HTMLElement;
	private nickname: HTMLInputElement;
	private hidenames: HTMLInputElement;

	onLogin: (nickname: string, token: string, hideNames: boolean) => void;

	constructor() {
		this.element = document.getElementById('welcome');
	}

	show() {
		let split = window.location.hash.split(',');
		let playerIsLoggedIn = split[0] == '#success';
		let token: string;
		let playerId: string;
		if (playerIsLoggedIn && split.length == 3) {
			token = split[1];
			playerId = split[2];
		}

		history.replaceState({}, document.title, "/");

		this.addEventListeners(playerIsLoggedIn, token, playerId);
		HtmlTranslator.showStartButton(playerIsLoggedIn);
	}

	private addEventListeners(playerIsLoggedIn: boolean, token: string, playerId: string) {

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

			this.onLogin(this.nickname.value, token, this.hidenames.checked);

			ev.preventDefault();
			return false;
		};
		form.addEventListener('submit', buttonAction);
		button.addEventListener('click', buttonAction);

		if (playerIsLoggedIn) {
			loginButton.addEventListener('click', () => {
				window.location.assign('/logout');
			});

			document.getElementById('logged-in-area').style.display = 'block';
			(<HTMLAnchorElement>document.getElementById('view-profile')).href = "/user/profile/view/" + playerId;
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