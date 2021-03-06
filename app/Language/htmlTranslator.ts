import Language = require('./');

interface LanguageHtmlDef {
	'hidenames': string;
	'disableparticles': string;
	'whatisit': string;
	'whatisit2': string;
	'controls': string;
	//These are duplicates of ones in the other file
	'ctrl1': string;
	'ctrl2': string;
	'ctrl3': string;

	'news': string;

	'feb2017': string;
	'feb2017n': string;

	'oct20162': string;
	'oct20162n': string;
	
	'oct2016': string;
	'oct2016n': string;
	
	'july2016': string;
	'july2016n': string;

	'june20163': string;
	'june20163n': string;

	'june20162': string;
	'june20162n': string;

	'june2016': string;
	'june2016n': string;

	'may2016': string;
	'may2016n': string;

	'privacy-policy': string;
	'tos': string;

	'fullscreen': string;
	'mistranslation': string;
	'feedback': string;
	'help': string;

	[key: string]: string;
}

let translationByInnerHtml = <{ [language: string]: LanguageHtmlDef }>{
	'es': {
		'hidenames': 'Ocultar nombres',
		'disableparticles': 'Deshabilitar partículas',

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

		'jun2017': 'Junio 2017. ¡Lanzamiento móvil!',
		'jun2017n':
			'<p>Hola a todos. Massive Match ya está disponible en el móvil, sólo tienes que pulsar los botones de arriba.</p>' +
			'<p>¡Disfrute y cuente a sus amigos!</p>',

		'apr2017': 'Abril 2017. Anuncio móvil!',
		'apr2017n':
			'<p>Hola de nuevo amigos. Recientemente hemos alcanzado el nivel 200000, buen trabajo! Como parte de las celebraciones <a href="https://twitter.com/massivematch/status/850520234423222272" target="_blank">anunciamos que Massive Match llegará al móvil este mes de junio!</a></p>' +
			'<p>Para mejorar la reproducción móvil, ahora puede tocar y mantener el mapa y, a continuación, arrástrelo para moverse. Por favor, inténtelo y díganos lo que piensa. ¡Que te diviertas!</p>',

		'mar20172':'Marzo de 2017. Correcciones',
		'mar20172n':
			"<p>Gracias a todos por la retroalimentación! Hemos cambiado el nivel de las plantas de nuevo a la piel normal como la mayoría de la gente encontró el alterno uno más difícil de mirar.</p>" +
			"<p>También arreglamos un error donde Pigs vs Pugs no tendría cerdos! Lamentamos mucho este, gracias por el informe!</p>",
	
		'mar2017':'Marzo de 2017. Gráficos y Tuning',
		'mar2017n':
			'<p>¡Hoy estamos agregando una segunda piel al juego! El nivel de Grow the Plant es el único lugar donde aparecerá por ahora. Por favor, díganos lo que piensa, usando el botón de retroalimentación en el menú.</p>' +
			'<p>También hemos hecho algunos cambios de dificultad, algunos de los niveles eran demasiado difíciles, por lo que ahora son un poco más fáciles. La siguiente cuenta regresiva de nivel es ahora precisa. Y el movimiento del jugador y las partículas del fósforo se han mejorado.</p>' +
			'<p>Disfrute, esperamos escuchar lo que piensa de los cambios!</p>',


		'feb2017':'Febrero de 2017. ¡Emotes!',
		'feb2017n':
			'<p>Este mes hemos añadido una característica que mucha gente ha estado pidiendo, emotes. Ahora usted puede expresar su agradecimiento o enojo con estas caras de fantasía.</p>' +
			'<p>Pulse la burbuja del discurso en la parte inferior de la pantalla para enviar una, que aparecen en la posición que hizo por última vez un movimiento.</p>',

		'nov2016': 'Noviembre de 2016. ¡Gráficos y mucho más!',
		'nov2016n':
			'<p>Este mes hemos añadido algunos nuevos efectos gráficos cuando haces una coincidencia. También actualizamos el área de bloque especial claro para despejar un área 5x5 en vez de un área 3x3.</p>' +
			'<p>Gracias a todos por la retroalimentación, por favor, dile a tus amigos acerca de Massive Match!</p>',
		'oct20162': 'Fines de octubre el año 2016',
		'oct20162n': 
			'<p>Hemos actualizado Massive Match para trabajar mejor en los teléfonos móviles.</p>' +
			'<p>Si tiene algún problema, por favor enviarnos alguna sugerencia utilizando el botón en el juego.</p>',

		'oct2016': 'Octubre de 2016. De vuelta al trabajo',
		'oct2016n': 
			'<p>Y de repente es octubre. Lo siento por el silencio en los últimos meses, hemos estado trabajando duro en otros proyectos. Pero hemos terminado con ellos, así que ya es hora de Massive Match!</p>' +
			'<p>Acabamos de lanzar un par de correcciones de errores y algunas mejoras a la traducción en español.</p>' +
			'<p>¡Disfruta y pásatelo bien!</p>',

		'july2016': 'Julio de 2016. Nuevos Niveles!',
		'july2016n': 
			'<p>Bienvenido a julio. Este mes tenemos 2 nuevos tipos de nivel!</p>' +
			'<p>El primero es <b>cultivar la planta</b>. Este es un nivel de cooperación, tiene que emparejar junto a la planta para hacerla crecer. Cultivar la planta a un cierto tamaño antes de la hora / mueve limitan a ganar.</p>' +
			'<p>La segunda es <b>mariposa VS abeja</b>. Este nivel es como equipo Llevar a los robots a la parte inferior. Trabajar en conjunto con su equipo para obtener su insecto hasta el fondo antes que el otro equipo puede.</p>' +
			'<p>Espero que disfrutes de los nuevos niveles. Por favor enviarme comentarios!</p>' +
			'<p>Divertirse y decirle a sus amigos :)</p>',

		'june20163': '22 de Junio de 2016. Actualización',
		'june20163n': 
			"<p>Acabamos de lanzar nuestra última actualización para junio. La característica más importante es la traducción al español. Debe obtener automáticamente si su equipo está configurado para español. Otros idiomas se añadirán en el futuro.</p>" +
			'<p><a style="color: lightgreen" href="https://docs.google.com/a/cozybarrel.com/forms/d/13TZ6l3P9dgQiFM0gf-txJ1ZwuUaqcC1HbLL8umwdCyI/viewform" target="_blank">Por favor, haga clic aquí para informar de los errores de traducción</a></p>' +
			"<p>También hemos añadido la votación nivel por lo que podemos obtener alguna información sobre qué tipos de nivel te gusta. Verás que después de cada nivel.</p>" +
			'<p>Hemos corregido un fallo que podría suceder a veces cuando se inició el juego. Lo sentimos acerca de eso!</p>' +
			'<p>Disfrutar y decirle a sus amigos :)</p>',

		'june20162': 'Junio de 2016. Mediados de mes las noticias',
		'june20162n': 
			"<p>Acabamos de poner algunas pequeñas mejoras viven. Esperemos que las cosas son ahora estables para que podamos trabajar en importantes características.<br/>" +
			'<ul>' +
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
			'<ul>' +
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
		'fullscreen': 'Pantalla completa<br/>',
		'mistranslation': 'Mala traducción<br/>',
		'feedback': 'Realimentación<br/>',
		'help': 'Ayuda',
	}
}

interface LanguageSpecialDef {
	'play-button': string;
	'nickname': string;
	'lhidenames': string;
	'ldisableparticles': string;
	'mistranslation': string;
}

let translationBySpecial = <{ [language: string]: LanguageSpecialDef }>{
	'es': {
		'play-button': 'Cargando...',
		'nickname': 'Apodo',
		'lhidenames': 'Ocultar otros nombres de los jugadores, recomendado para los jugadores jóvenes',
		'ldisableparticles': 'Detiene los efectos de partículas que aparecen cuando se realizan los fósforos. Hace que el juego funcione más suave en dispositivos de bajo rendimiento',
		'mistranslation': 'https://docs.google.com/a/cozybarrel.com/forms/d/13TZ6l3P9dgQiFM0gf-txJ1ZwuUaqcC1HbLL8umwdCyI/viewform',
	}
}

let playButton: {[key: string]: string} = {
	'en': 'Play',
	'es': 'Jugar',
}

class HtmlTranslator {
	static apply() {
		let t = translationByInnerHtml[Language.polyglot.locale()];
		if (!t) {
			document.getElementById('mistranslation').style.display = 'none';
			return;
		}
		let special = translationBySpecial[Language.polyglot.locale()];
		(<HTMLInputElement>document.getElementById('nickname')).placeholder = special['nickname'];
		(<HTMLLabelElement>document.getElementById('lhidenames')).title = special['lhidenames'];
		(<HTMLLabelElement>document.getElementById('ldisableparticles')).title = special['ldisableparticles'];
		(<HTMLAnchorElement>document.getElementById('mistranslation')).href = special['mistranslation'];

		for (let key in t) {
			document.getElementById(key).innerHTML = t[key];
		}
	}

	static showStartButton() {
		let btn = document.getElementById('play-button');
		if ((<any>btn).value) {
			(<HTMLInputElement>btn).value = playButton[Language.polyglot.locale()];
		} else {
			btn.innerText = playButton[Language.polyglot.locale()];
		}
	}
}

export = HtmlTranslator;