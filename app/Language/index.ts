/// <reference path="../../typings/node-polyglot/node-polyglot.d.ts" />
import Polyglot = require('node-polyglot');

interface LanguageDef {
	//Renderer
	'players x': string;
	'you': string;
	'anonymous': string;

	//Trackers
	'animals': string;
	'pigs/pugs': string;
	'points': string;
	'rescues': string;
	'robodrops': string;

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

	//DetectorDisplays
	'xremaining': string;
	'teamx': string;
	'movesremainingx': string;
	'cagesremainingx': string;
	'timeremainingx': string;
	'pointsrequiredx': string;
	'animalsremainingx': string;

	//gameOverOverlay
	'out of moves': string;
	'you win': string;
	'defeated': string;
	'level failed': string;
	'level complete': string;
	'you came': string;
	'next level in': string;
	'rate level': string;
	'click to continue': string;

	//Help
	'controls': string;
	'helpline1': string;
	'helpline2': string;
	'helpline3': string;
	'helpline4': string;
	'helpline5': string;
	'helpline6': string;
	'special matches': string;
	'clears in a line': string;
	'clears area': string;
	'clears animal': string;
}

let translation = <{ [language: string]: LanguageDef }>{
	'en': {
		//Renderer
		'players x': 'Players: %{num}',
		'you': 'You',
		'anonymous': 'Anonymous',

		//Trackers
		'animals': 'Animals',
		'pigs/pugs': 'Pigs/Pugs',
		'points': 'Points',
		'rescues': 'Rescues',
		'robodrops': 'RoboDrops',

		//levelDetailsOverlay
		'level x': 'Level %{num}',
		'click to start': 'Click to start',
		'size': 'Size',

		//Level details
		'get x points': 'Get %{num} points',
		'match x': 'Match %{num} animals',
		'rescue from cages': 'Rescue the animals from their cages',
		'robots to bottom': 'Get %{smart_count} Robot to the bottom||||Get %{smart_count} Robots to the bottom',
		'within x secs': 'within %{sec} seconds',
		'within x moves': 'within %{num} moves',
		'pigsvspugs': 'Pigs VS Pugs',
		'pigs': 'Pigs',
		'pugs': 'Pugs',
		'youareonteam': 'You are on team %{team}',
		'matchbutdontmatch': "Match %{team}, but don't match %{notteam}",

		//DetectorDisplays
		'xremaining': '%{thing} remaining: %{num}',
		'teamx': 'Team %{team}',
		'movesremainingx': 'Moves remaining %{num}',
		'cagesremainingx': 'Cages remaining: %{num}',
		'timeremainingx': 'Time remaining: %{num}',
		'pointsrequiredx': 'Points required: %{num}/%{total}',
		'animalsremainingx': 'Animals remaining: %{num}',

		//gameOverOverlay
		'out of moves': 'Out of Moves!',
		'you win': 'You Win',
		'defeated': 'Defeated',
		'level failed': 'Level Failed',
		'level complete': 'Level Complete!',
		'you came': 'You came #%{rank} of %{playerCount} players',
		'next level in': 'Next level in %{sec} seconds',
		'rate level': 'Rate this level',
		'click to continue': 'Click to continue',
		
		//Help
		'controls': 'Controles',
		'helpline1': 'Click and drag animals to match them.',
		'helpline2': 'You can only drag ones that will make a 3 in a row match.',
		'helpline3': 'Zoom in and out using the mouse wheel.',
		'helpline4': 'Move around by dragging with the right mouse button.',
		'helpline5': 'You can also use the keyboard to look around',
		'helpline6': '(Arrow Keys or WASD)',
		'special matches': 'Special Matches',
		'clears in a line': 'When matched, clears animals in a line',
		'clears area': 'When matched, clears a small area',
		'clears animal': 'When swapped with an animal, clears that animal'
	},

	'es': {
		//Renderer
		'players x': 'Jugadores: %{num}',
		'you': 'Usted',
		'anonymous': 'Anónimo',

		//Trackers
		'animals': 'Animales',
		'pigs/pugs': 'Cerdos/Barros amasados',
		'points': 'Puntos',
		'rescues': 'Rescates',
		'robodrops': 'Gotas del robot',

		//levelDetailsOverlay
		'level x': 'Nivel %{num}',
		'click to start': 'Haga clic para iniciar',
		'size': 'Tamaño',

		//Level details
		'get x points': 'Obtener %{num} puntos',
		'match x': 'Emparejar %{num} animales',
		'rescue from cages': 'Rescata a los animales desde el interior de las jaulas',
		'robots to bottom': 'Obtener %{smart_count} del robot a la parte inferior||||Obtener %{smart_count} Robots a la parte inferior',
		'within x secs': 'dentro de los %{sec} segundos',
		'within x moves': 'dentro de los %{num} movimientos',
		'pigsvspugs': 'Cerdos vs Barros amasados',
		'pigs': 'Cerdos',
		'pugs': 'Barros amasados',
		'youareonteam': 'Usted está en %{team} el equipo',
		'matchbutdontmatch': "Emparejar con %{team}, pero no emparejar %{notteam}",

		//DetectorDisplays
		'xremaining': '%{thing} restantes: %{num}',
		'teamx': '%{team} equipo',
		'movesremainingx': 'Movimientos restantes: %{num}',
		'cagesremainingx': 'Jaulas restantes: %{num}',
		'timeremainingx': 'Tiempo restante: %{num}',
		'pointsrequiredx': 'Puntos necesarios: %{num}/%{total}',
		'animalsremainingx': 'Animales restantes: %{num}',

		//gameOverOverlay
		'out of moves': '¡Sin movimientos!',
		'you win': '¡Tú ganas!',
		'defeated': 'Derrotado',
		'level failed': 'Nivel fracasado',
		'level complete': '¡Nivel completado!',
		'you came': 'Usted vino #%{rank} de %{playerCount} jugadores',
		'next level in': 'Siguiente nivel en %{sec} segundos',
		'rate level': 'Valorar este nivel',
		'click to continue': 'Haz click para continuar',
		
		//Help
		'controls': 'Controles',
		'helpline1': 'Haga clic y arrastre los animales para emparejar ellos.',
		'helpline2': 'Sólo se pueden arrastrar los que van a hacer un 3 en un emparejar de consecutivo.',
		'helpline3': 'Acercar y alejar con la rueda del ratón.',
		'helpline4': 'Moverse alrededor arrastrando con el botón derecho del ratón.',
		'helpline5': 'También puede utilizar el teclado para mirar a su alrededor',
		'helpline6': '(Teclas de flecha o WASD)',

		'special matches': 'Emparejar especiales',
		'clears in a line': 'Cuando se emparejan, rescata los animales en una línea',
		'clears area': 'Cuando se emparejan, rescata a un área pequeña',
		'clears animal': 'Cuando se intercambiada con un animal, rescatas ese animal'
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