import Language = require('./');

interface LanguageHtmlDef {
	'hidenames': string;
	'whatisit': string;
	'whatisit2': string;
	'controls': string;
	//These are duplicates of ones in the other file
	'ctrl1': string;
	'ctrl2': string;
	'ctrl3': string;

	'news': string;

	'june20162': string;
	'june20162n': string;

	'june2016': string;
	'june2016n': string;

	'may2016': string;
	'may2016n': string;

	'privacy-policy': string;
	'tos': string;

	'mistranslation': string;
	'feedback-button': string;
	'help-button': string;

	[key: string]: string;
}

let translationByInnerHtml = <{ [language: string]: LanguageHtmlDef }>{
	'es': {
		'hidenames': 'Ocultar nombres',

		'whatisit': '¿Qué es?',
		'whatisit2': 
			'Massive Match es un partido de 3 juegos como Bejeweled o Candy Crush Saga, pero con un giro multijugador masivo!<br/>' +
			'Juega en una cuadrícula mucho más grande donde todo el mundo está tratando de hacer un partido. Rápido. Frenético. Divertido.',
		
		'controls': 'Controles',
		'ctrl1': 
			'Haga clic y arrastre los animales para emparejar ellos.<br/>' +
			'Sólo se pueden arrastrar los que van a hacer un 3 en un emparejar de consecutivo.',
		'ctrl2': 
			'Acercar y alejar con la rueda del ratón.<br/>' +
			'Moverse alrededor arrastrando con el botón derecho del ratón.',
		'ctrl3': 'Cada nivel tiene un objetivo diferente, prestar atención a ellos.',

		'news': 'Noticias',
		'june20162': 'Junio de 2016. Mediados de mes las noticias',
		'june20162n': 
			"<p>Acabamos de poner algunas pequeñas mejoras viven. Esperemos que las cosas son ahora estables para que podamos trabajar en importantes características.<br/>" +
			'<ul style="display:inline-block; text-align: left">' +
				'<li>Mejora de detalles a nivel de las pantallas</li>' +
				'<li>Robots desaparecen cuando llegan a la parte inferior</li>' +
				'<li>Arreglo para algunas cárceles al azar</li>' +
				'<li>mejoras en el rendimiento</li>' +
				'<li>optimización de la red</li>' +
			'</ul>',

		'june2016': 'Junio de 2016. Una semana',
		'june2016n': 
			'<p>Massive Match es ahora una semana de edad!<br/><span style="color: yellow">GRACIAS</span> a todos nuestros jugadores.</p>' +
			"<p>Since the release we've done a lot of bug fixes. Existen todavía algunos pequeños errores que esperamos solucionar pronto.</p>" +
			"Por lo tanto, lo que viene a continuación?<br/>" +
			'<ul style="display:inline-block; text-align: left">' +
				'<li>Una carga más rápida</li>' +
				'<li>La eliminación de retardo</li>' +
				'<li>Cambiar las jaulas para ser más fácil de ver</li>' +
				'<li>balanceo de nivel</li>' +
			'</ul>' +
			"<p>Y más en base a sus sugerencias. Envíenos algunos comentarios utilizando el botón en la parte inferior derecha, nos gustaría escucharlo.</p>" +
			"<p>Si le van a divertido favor diga a sus amigos, que nos ayuda mucho. Espere más noticias de finales de este mes. Adiós</p>",

		'may2016': 'Mayo de 2016. Estamos en Alfa!',
		'may2016n': 
			'Massive Match se encuentra ahora en alfa pública! Como estamos en alfa, las cosas van a ser roto y el juego probablemente se retrasarán a veces. Por favor déjenos una cierta regeneración con cualquier sugerencia que tenga.<br/>' +
			'El enlace de retroalimentación es en la parte inferior derecha.',

		'privacy-policy': 'Política de privacidad',
		'tos': 'Términos de servicio',
		'mistranslation': 'Mala traducción',
		'feedback-button': 'Feedback',
		'help-button': 'Ayuda',
	}
}

interface LanguageSpecialDef {
	'play-button': string;
	'nickname': string;
	'lhidenames': string;
	'mistranslation': string;
}

let translationBySpecial = <{ [language: string]: LanguageSpecialDef }>{
	'es': {
		'play-button': 'Jugar',
		'nickname': 'Apodo',
		'lhidenames': 'Ocultar otros nombres de los jugadores, recomendado para los jugadores jóvenes',
		'mistranslation': 'https://docs.google.com/a/cozybarrel.com/forms/d/13TZ6l3P9dgQiFM0gf-txJ1ZwuUaqcC1HbLL8umwdCyI/viewform',
	}
}

class HtmlTranslator {
	static apply() {
		let t = translationByInnerHtml[Language.polyglot.locale()];
		if (!t) {
			(<HTMLInputElement>document.getElementById('play-button')).value = 'Play';
			document.getElementById('mistranslation-button').style.display = 'none';
			return;
		}
		let special = translationBySpecial[Language.polyglot.locale()];
		(<HTMLInputElement>document.getElementById('play-button')).value = special['play-button'];
		(<HTMLInputElement>document.getElementById('nickname')).placeholder = special['nickname'];
		(<HTMLLabelElement>document.getElementById('lhidenames')).title = special['lhidenames'];
		(<HTMLAnchorElement>document.getElementById('mistranslation')).href = special['mistranslation'];

		for (let key in t) {
			document.getElementById(key).innerHTML = t[key];
		}
	}
}

export = HtmlTranslator;