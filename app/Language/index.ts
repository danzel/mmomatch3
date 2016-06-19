/// <reference path="../../typings/node-polyglot/node-polyglot.d.ts" />
import Polyglot = require('node-polyglot');

interface LanguageDef {

	//gameOverOverlay
	'out of moves': string;
	'you win': string;
	'defeated': string;
	'level failed': string;
	'level complete': string;
	'you came': string;
	'next level in': string;
	'rate level': string;

}

let translation = <{ [language: string]: LanguageDef }>{
	'en': {
		//gameOverOverlay
		'out of moves': 'Out of Moves!',
		'you win': 'You Win',
		'defeated': 'Defeated',
		'level failed': 'Level Failed',
		'level complete': 'Level Complete!',
		'you came': 'You came #%{rank} of %{playerCount} players',
		'next level in': 'Next level in %{sec} seconds',
		'rate level': 'Rate this level'
	},

	'es': {
		//gameOverOverlay
		'out of moves': '¡Sin movimientos!',
		'you win': '¡Tú ganas!',
		'defeated': 'Derrotado',
		'level failed': 'Nivel fracasado',
		'level complete': '¡Nivel completado!',
		'you came': 'Usted vino #%{rank} de %{playerCount} jugadores',
		'next level in': 'Siguiente nivel en %{sec} segundos',
		'rate level': 'Valorar este nivel'
	}
};

class Language {
	static polyglot: Polyglot;

	static init() {
		let lang = 'es';//(window.navigator.language || 'en').toLowerCase();

		//https://github.com/airbnb/polyglot.js/blob/master/index.js#L242
		if (lang != 'pt-br') {
			let index = lang.indexOf('-');
			if (index > 0) {
				lang = lang.substr(0, index);
			}
		}

		Language.polyglot = new Polyglot({
			phrases: translation[lang] || translation['en'],
			locale: lang
		});
	}

	static t(key: string, interpolationOptions?: Polyglot.InterpolationOptions): string {
		return Language.polyglot.t(key, interpolationOptions);
	}
};

export = Language;