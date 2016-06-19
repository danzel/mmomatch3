/// <reference path="../../typings/node-polyglot/node-polyglot.d.ts" />
import Polyglot = require('node-polyglot');

interface LanguageDef {

	//levelDetailsOverlay
	'level x': string;
	'click to start': string;
	'size': string;

	//Level details
	'get x points': string;
	'match x': string;
	'rescue from cages': string;
	'robots to bottom': string;
	'within x secs': string;
	'within x moves': string;
	'pigsvspugs': string;
	'pigs': string;
	'pugs': string;
	'youareonteam': string;
	'matchbutdontmatch': string;

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
		//levelDetailsOverlay
		'level x': 'Level %{num}',
		'click to start': 'Click to start',
		'size': 'Size',

		//Level details
		'get x points': 'Get %{num} points',
		'match x': 'Match %{num} animals',
		'rescue from cages': 'Rescue the animals from their cages',
		'robots to bottom': 'Get %{num} Robots to the bottom',
		'within x secs': 'within %{sec} seconds',
		'within x moves': 'within %{num} moves',
		'pigsvspugs': 'Pigs VS Pugs',
		'pigs': 'Pigs',
		'pugs': 'Pugs',
		'youareonteam': 'You are on team %{team}',
		'matchbutdontmatch': "Match %{team}, but don't match %{notteam}",

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
		//levelDetailsOverlay
		'level x': 'Nivel %{num}',
		'click to start': 'Haga clic para iniciar',
		'size': 'Tamaño',

		//Level details
		'get x points': 'Obtener %{num} puntos',
		'match x': 'Emparejar %{num} animales',
		'rescue from cages': 'Rescata a los animales desde el interior de las jaulas',
		'robots to bottom': 'Consigue %{num} Robots a la parte inferior',
		'within x secs': 'dentro de los %{sec} segundos',
		'within x moves': 'dentro de los %{num} movimientos',
		'pigsvspugs': 'Cerdos vs Barros amasados',
		'pigs': 'Cerdos',
		'pugs': 'Barros amasados',
		'youareonteam': 'Usted está en %{team} el equipo',
		'matchbutdontmatch': "Emparejar con %{team}, pero no emparejar %{notteam}",

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