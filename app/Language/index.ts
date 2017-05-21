/// <reference path="../../typings/node-polyglot/node-polyglot.d.ts" />
import Polyglot = require('node-polyglot');

interface LanguageDef {
	//Renderer
	'players x': string;
	'you': string;
	'anonymous': string;

	//Score Trackers
	'animals': string;
	'pigs/pugs': string;
	'points': string;
	'rescues': string;
	'robodrops': string;
	'drops': string;
	'plants': string;

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
	'matchnexttoplant': string;

	'butterflyvsbee': string;
	'butterfly to bottom': string;
	'bee to bottom': string;
	'before butterfly to bottom': string;
	'before bee to bottom': string;

	//DetectorDisplays
	'xremaining': string;
	'teamx': string;
	'movesremainingx': string;
	'cagesremainingx': string;
	'timeremainingx': string;
	'pointsrequiredx': string;
	'animalsremainingx': string;
	'growplantx': string;
	'plantremainingx': string;

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
	'connecting': string;
	'connecting refresh': string;

	'newversion': string;
	'newversion1': string;
	'newversion2': string;
	'newversion3': string;
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
		'drops': 'Drops',
		'plants': 'Plants',

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
		'matchnexttoplant': 'Match next to the plant to grow it',

		'butterflyvsbee': 'Butterfly VS Bee',
		'butterfly to bottom': 'Get the Butterfly to the bottom',
		'bee to bottom': 'Get the Bee to the bottom',
		'before butterfly to bottom': 'before the Butterfly',
		'before bee to bottom': 'before the Bee',

		//DetectorDisplays
		'xremaining': '%{thing} remaining: %{num}',
		'teamx': 'Team %{team}',
		'movesremainingx': 'Moves remaining %{num}',
		'cagesremainingx': 'Cages remaining: %{num}',
		'timeremainingx': 'Time remaining: %{num}',
		'pointsrequiredx': 'Points required: %{num}/%{total}',
		'animalsremainingx': 'Animals remaining: %{num}',
		'growplantx': 'Grow the plant to size %{num}',
		'plantremainingx': 'Grow %{smart_count} more plant||||Grow %{smart_count} more plants',

		//gameOverOverlay
		'out of moves': 'Out of Moves!',
		'you win': 'You Win!',
		'defeated': 'Defeated',
		'level failed': 'Level Failed',
		'level complete': 'Level Complete!',
		'you came': 'You came #%{rank} of %{smart_count} player||||You came #%{rank} of %{smart_count} players',
		'next level in': 'Next level in %{sec} seconds',
		'rate level': 'Rate this level',
		'click to continue': 'Click to continue',

		//Help
		'controls': 'Controls',
		'helpline1': 'Click and drag animals to match them.',
		'helpline2': 'You can only drag ones that will make a 3 in a row match.',
		'helpline3': 'Zoom in and out using the mouse wheel.',
		'helpline4': 'Move around by dragging with the right mouse button.',
		'helpline5': 'You can also use the keyboard to look around',
		'helpline6': '(Arrow Keys or WASD)',
		'special matches': 'Special Matches',
		'clears in a line': 'When matched, clears animals in a line',
		'clears area': 'When matched, clears a small area',
		'clears animal': 'When swapped with an animal, clears that animal',
		'connecting': 'Connecting...',
		'connecting refresh': 'If this continues, try refreshing the page',
		'connecting mobile refresh': 'If this continues, check your Internet connection',

		'newversion': 'New Version!',
		'newversion1': 'A new version has been released.',
		'newversion2': 'Please refresh the page to get the new version.',
		'newversion3': 'Automatically refreshing in 10 seconds...',
	},

	'es': {
		//Renderer
		'players x': 'Jugadores: %{num}',
		'you': 'Usted',
		'anonymous': 'Anónimo',

		//Trackers
		'animals': 'Animales',
		'pigs/pugs': 'Cerdos/Perros',
		'points': 'Puntos',
		'rescues': 'Rescates',
		'robodrops': 'Gotas del robot',
		'drops': 'Gotas',
		'plants': 'Plantas',

		//levelDetailsOverlay
		'level x': 'Nivel %{num}',
		'click to start': 'Haga clic para iniciar',
		'size': 'Tamaño',

		//Level details
		'get x points': 'Obtener %{num} puntos',
		'match x': 'Emparejar %{num} animales',
		'rescue from cages': 'Rescata a los animales desde el interior de las jaulas',
		'robots to bottom': 'Llevar %{smart_count} del robot a la parte inferior||||Llevar %{smart_count} Robots a la parte inferior',
		'within x secs': 'dentro de los %{sec} segundos',
		'within x moves': 'dentro de los %{num} movimientos',
		'pigsvspugs': 'Cerdos vs Perros',
		'pigs': 'Cerdos',
		'pugs': 'Perros',
		'youareonteam': 'Usted está en %{team} el equipo',
		'matchbutdontmatch': "Emparejar con %{team}, pero no emparejar %{notteam}",
		'matchnexttoplant': 'Emparejar al lado de la planta para crecer',

		'butterflyvsbee': 'Mariposa VS Abeja',
		'butterfly to bottom': 'Mueva la mariposa a la parte inferior',
		'bee to bottom': 'Mueva la abeja a la parte inferior',
		'before butterfly to bottom': 'antes de la mariposa',
		'before bee to bottom': 'antes que la abeja',

		//DetectorDisplays
		'xremaining': '%{thing} restantes: %{num}',
		'teamx': '%{team} equipo',
		'movesremainingx': 'Movimientos restantes: %{num}',
		'cagesremainingx': 'Jaulas restantes: %{num}',
		'timeremainingx': 'Tiempo restante: %{num}',
		'pointsrequiredx': 'Puntos necesarios: %{num}/%{total}',
		'animalsremainingx': 'Animales restantes: %{num}',
		'growplantx': 'Cultivar la planta a la tamaño %{num}',
		'plantremainingx': 'Crecer más %{smart_count} planta||||Crecer más %{smart_count} plantas',

		//gameOverOverlay
		'out of moves': '¡Sin movimientos!',
		'you win': '¡Tú ganas!',
		'defeated': 'Derrotado',
		'level failed': 'Nivel fallido',
		'level complete': '¡Nivel completado!',
		'you came': 'Usted fue #%{rank} de %{smart_count} jugador||||Usted fue #%{rank} de %{smart_count} jugadores',
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
		'clears animal': 'Cuando se intercambiada con un animal, rescatas ese animal',

		'connecting': 'Conectando...',
		'connecting refresh': 'Si esto sigue así, intenta actualizar la página',
		'connecting mobile refresh': 'Si esto continúa, compruebe su conexión a Internet',

		'newversion': '¡Nueva versión!',
		'newversion1': 'Una nueva versión ha sido puesto en libertad.',
		'newversion2': 'Por favor, actualice la página para obtener la nueva versión.',
		'newversion3': 'Refrescante de forma automática en 10 segundos...',
	}
};

class Language {
	static polyglot = new Polyglot();

	static init() {
		let lang = (window.navigator.language || 'en').toLowerCase();

		//https://github.com/airbnb/polyglot.js/blob/master/index.js#L242
		if (lang != 'pt-br') {
			let index = lang.indexOf('-');
			if (index > 0) {
				lang = lang.substr(0, index);
			}
		}

		if (!translation[lang]) {
			lang = 'en';
		}

		Language.polyglot.extend(translation[lang]);
		Language.polyglot.locale(lang);
	}

	static t(key: string, interpolationOptions?: Polyglot.InterpolationOptions): string {
		return Language.polyglot.t(key, interpolationOptions);
	}
};

export = Language;