/************************************************************
 * 
 * V A R I A B L E S
 * Globales del sitio
 * 
 ************************************************************/

/* 
 * @var w: Width
 * @var h: height
 * @var version: Versión de la librería
 */

var _width,
	_height,
	_scroll,
	version = "1.0";

/***************************************************
 * 
 * O B J E T O S
 * Generales del sitio
 * 
 ****************************************************/

var ars1 = {
	/*
	 * @method responsive: funcion que obtiene los valores de las variables que contiene al hacer resize
	 * @var w: ancho interno de la ventana del navegador, sin scroll
	 * @var h: altura de la ventana del navegador
	 */

	responsive: function (fun) {
		"use strict";
		_width = window.innerWidth;
		_height = $(window).height();
		if (typeof fun === 'function') {
			fun();
			$(window).on('resize', function () {
				_width = window.innerWidth;
				_height = $(window).height();
				fun();
			});
		} else {
			console.warn('ars1.responsive(¿function?) : Se debe pasar una función como argumento');
		}
	},
	scrolling: function (fun) {
		"use strict";
		_scroll = $(window).scrollTop();
		if (typeof fun === 'function') {
			fun();
			$(window).on('scroll', function () {
				_scroll = $(window).scrollTop();
				fun();
			});
		} else {
			console.warn('ars1.scrolling(¿function?) : Se debe pasar una función como argumento');
		}
	},
	/*
	 * @property browsers: funcion que detecta los navegadores y les aplica una clase, también aplica propiedades a elementos que requieran algo especial para ciertos navegadores 
	 */
	browsers: function () {
		"use strict";
		//Detectar IE & Edge
		var isIE = /*@cc_on!@*/ false || !!document.documentMode;
		if (isIE) {
			$('html').addClass('ie-browser');
		}
		var isEdge = !isIE && !!window.StyleMedia;
		if (isEdge) {
			$('html').addClass('edge-browser');
		}
		var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
		if (isIE11) {
			$('html').addClass('ie-11');
		}
		if (document.all && (!document.documentMode || (document.documentMode && document.documentMode <= 10))) {
			$('html').removeClass('ie-11');
		}
		if (document.all && (!document.documentMode || (document.documentMode && document.documentMode === 10))) {
			$('html').addClass('ie-10');
		}
		if (document.all && (!document.documentMode || (document.documentMode && document.documentMode === 9))) {
			$('html').addClass('ie-9');
		}

		// Opera
		var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		if (isOpera) {
			$('html').addClass('opera-browser');
		}

		// Firefox 1.0+
		var isFirefox = typeof InstallTrigger !== 'undefined';
		if (isFirefox) {
			$('html').addClass('firefox-browser');
		}

		// Safari 3.0+ "[object HTMLElementConstructor]" 
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
			return p.toString() === "[object SafariRemoteNotification]";
		})(!window['safari'] || safari.pushNotification);
		if (isSafari) {
			$('html').addClass('safari-browser');
		}

		// Chrome 1+
		var isChrome = !!window.chrome && !!window.chrome.webstore;
		if (isChrome) {
			$('html').addClass('chrome-browser');
		}

		// FALLBACKS
		//-- Fuerza a que el input se bloquee
		if ($('html').hasClass('ie-browser')) {
			$('input[readonly]').focus(function () {
				this.blur();
			});
		}

	},
	/*
	 * @propiedad: tooltips: 
	 * @param cargar: 
	 */
	tooltips: function (cargar) {
		"use strict";
		if (cargar) {
			$('.tooltip--before').remove();
		}
		$('.tooltip').each(function () {
			var dataTooltip = $(this).data('tooltip');
			$(this).append('<span class="tooltip--before">' + dataTooltip + '</span>').find('.tooltip--before');
		});
	},

	/*
	 * @propiedad: botones
	 * @info: Funcionalidad para desabilitar los tags de tipo link (a) a los cuales se requiera deshabilitar
	 */
	botones: function () {
		"use strict";
		$('.btn').each(function () {
			var onc = $(this).attr('onclick');
			if ($(this).hasClass('deshabilitado')) {
				$(this).click(function (e) {
					e.preventDefault();
				}).attr('onclick', '');
			} else {
				$(this).attr('onclick', onc);
			}
		});
	},
	/*
	 * @propiedad: alertas
	 * @info: acciones creadas para interactuar con las alertas, abrir y cerrar alerta
	 * @var hash: obtiene el valor del atributo href
	 */
	alertas: function () {
		"use strict";
		$('.abrir-alerta').click(function () {
			var hash = $(this).attr('href');
			$(hash).slideDown('fast');
			return false;
		});

		$('.alerta--desplegable').each(function () {
			$(this).find('.alerta__cerrar').click(function () {
				$(this).parents('.alerta').slideUp('fast');
			});
		});
	},
	/*
	 * @propiedad: menú desplegable
	 * @info: Funcionalidad para crear menues desplegables hasta 3 niveles
	 * @var activo: a travéz de la clase abierto se declara si el desplegable debe estar abierto
	 */
	menu_desplegable: function () {
		"use strict";
		var activo = false,
			menuDesplegable = $('.menu-desplegable');

		menuDesplegable.each(function (i, el) {
			/* Nivel 1 */
			$(el).find("ul").addClass('submenu');
			$(el).find("> ul").addClass('submenu--uno');
			$(el).find(".submenu--uno > li").has('ul').each(function (i, el) {
				if ($(el).hasClass("abierto")) {
					activo = i;
				} else {
					activo = false;
				}
			});
			var abrirSubmenu = $(el).find('.submenu--uno > li:has(ul) > a');
			$(el).find(".submenu--uno").accordion({
				animate: 200,
				active: activo,
				collapsible: true,
				heightStyle: "content",
				header: abrirSubmenu,
				icons: {
					"header": "ars1-mas",
					"activeHeader": "ars1-menos"
				}

			});

			/* Nivel 2 */
			$(el).find(".submenu--uno > li > ul").addClass('submenu--dos');
			var activo = false;
			$(el).find(".submenu--dos li").has('ul').each(function (i, el) {
				if ($(el).hasClass("abierto")) {
					activo = i;
				} else {
					activo = false;
				}
			});
			var abrirSubmenu = $(el).find('.submenu--dos > li:has(ul) > a');
			$(el).find(".submenu--dos").accordion({
				animate: 200,
				active: activo,
				collapsible: true,
				heightStyle: "content",
				header: abrirSubmenu,
				icons: {
					"header": "ars1-abajo",
					"activeHeader": "ars1-arriba"
				}

			});

			/* Nivel 3 */
			$(el).find(".submenu--dos > li > ul").addClass('submenu--tres');
			var activo = false;
			$(el).find(".submenu--tres li").has('ul').each(function (i, el) {
				if ($(el).hasClass("abierto")) {
					activo = i;
				} else {
					activo = false;
				}
			});
			var abrirSubmenu = $(el).find('.submenu--tres > li:has(ul) > a');
			$(el).find(".submenu--tres").accordion({
				animate: 200,
				active: activo,
				collapsible: true,
				heightStyle: "content",
				header: abrirSubmenu,
				icons: {
					"header": "ars1-abajo",
					"activeHeader": "ars1-arriba"
				}

			});
		});
	},
	menu_responsive: {
		el: '.menu-responsive',
		abrir: function (ico, clase) {
			if (!$(ars1.menu_responsive.el).hasClass('activo')) {
				$(ars1.menu_responsive.el).addClass('activo');
				$(ico).addClass(clase);
				$('html').addClass('menu-abierto');
			}
		},
		cerrar: function (ico, clase) {
			if ($(ars1.menu_responsive.el).hasClass('activo')) {
				$(ars1.menu_responsive.el).removeClass('activo');
				$(ico).removeClass(clase);
				$('html').removeClass('menu-abierto');
			}
		}
	},
	/*
	 * @propiedad: formularios
	 * @info: Varias funcionalidades para elementos de formularios
	 * @var elementosForms: encuentra todos los elementos seleccionados
	 */
	formularios: function () {
		"use strict";
		var elementosForms = $('.form').find('.text, select, textarea');
		elementosForms.each(function () {
			var item = $(this),
				padre = item.parents('.form__grupo');

			$('.form__input').has('.icono').addClass('form__input--icono');

			item.focus(function () {
				padre.addClass('form__grupo--activo');

			}).on('blur change', function () {

				padre.removeClass('form__grupo--activo');

			});
			if (item.is(':disabled')) {
				item.parents('.form__grupo').addClass('form__grupo--deshabilitado');
			}
		});

		$('.radio:disabled, .checkbox:disabled').each(function () {
			$(this).parents('.form__input').addClass('form__input--deshabilitado');
		});

		// Checkboxs
		$('.checkbox, .radio').change(function () {
			if ($(this).is(':checked')) {
				$(this).addClass('checked').parent().addClass('form__input--checked');
			} else {
				$(this).removeClass('checked').parent().removeClass('form__input--checked');
			}
		}).each(function () {
			if ($(this).attr('checked')) {
				$(this).addClass('checked').parent().addClass('form__input--checked');
			} else {
				$(this).removeClass('checked').parent().removeClass('form__input--checked');
			}
		});

		$('.radio').not(':disabled').click(function () {
			$(this).parents('.form__grupo').find('.radio').removeClass('checked').parent().removeClass('form__input--checked');
			$(this).addClass('checked').parent().addClass('form__input--checked');
		});

		// Subir archivos
		$(".submit__input").each(function () {
			$(this).change(function (nombre) {
				var valDefault = $(this).val();
				var nombre = $(this).val().split('\\').pop(),
					padre = $(this).parents('.form__input');

				if (valDefault.length !== 0) {
					if (nombre.length > 20) {
						nombre = nombre.substr(0, 10) + '...' + nombre.substr(nombre.length - 10, nombre.length);
						setTimeout(function () {
							padre.find(".submit__nombre-archivo").attr('data-archivo', nombre).text(nombre);
						}, 2000);
					} else {
						setTimeout(function () {
							padre.find(".submit__nombre-archivo").attr('data-archivo', nombre).text(nombre);
						}, 2000);
					}

					if (padre.hasClass('submit--cargando')) {
						padre.removeClass('submit--cargando submit--cargado');
						setTimeout(function () {
							padre.addClass('submit--cargando');
						}, 100);
						setTimeout(function () {
							padre.addClass('submit--cargado');
						}, 2000);
					} else {
						setTimeout(function () {
							padre.addClass('submit--cargando');
						}, 100);
						setTimeout(function () {
							padre.addClass('submit--cargado');
						}, 2000);
					}
				}

			});

			function resumirNombre(str) {
				if (nombre.length > 35) {
					return nombre.substr(0, 20) + '...' + nombre.substr(nombre.length - 10, nombre.length);
				}
				return nombre;
			}

		});

		// Label animado
		$('.form__grupo--animado').each(function () {
			var grupo = $(this),
				input = grupo.find('.text, textarea');

			input.change(function () {
				if ($(this).val().length !== 0) {
					grupo.find('label').addClass('focus');
				}
			});

			input.focus(function () {
				grupo.find('label').addClass('focus');
			});

			input.blur(function () {
				if ($(this).val().length === 0 || ($(this).data('tipo') == "tipo_telefono" && $(this).val() == "+")) {
					grupo.find('label').removeClass('focus');
				}
			});
		});
	},
	dividir_palabras: function () {
		"use strict";
		// Contar palabras, dividir por la mitad e agrupar en un spam
		var palabra = $('.dividir-palabras');
		palabra.each(function () {
			if (!$(this).hasClass('palabra-dividida')) {
				/*
				data-fraccion se le asigna al elemento que se divira con un valor que dependera del total de sus palabras

				Ej:

					"este texto tiene en total 10 palabras incluyendo el numero"
					el "data-fraccion" es de 5 (data-fraccion="5")

					Entonces tenemos: 10/5 = 2

					Entonces está funcion contara 2 palabras y el resto las agrupará en un span

				*/
				var fraccion = $(this).data('fraccion');
				if (fraccion === undefined) {
					fraccion = 2;
				}
				var t = $(this).text();
				var splitT = t.split(" ");
				var halfIndex = Math.round(splitT.length / fraccion);
				var newText = "";
				for (var i = 0; i < splitT.length; i++) {
					if (i == halfIndex) {
						newText += "<span>";
					}
					newText += splitT[i] + " ";
				}
				newText += "</span>";
				$(this).html(newText).addClass('palabra-dividida');
			}
		});
	},
	sticky: function (el) {
		"use strict";
		$(el).each(function () {
			var sticky = $(this),
				st = el.split('.').join(""),
				stickyTop = sticky.offset().top;
			$(window).scroll(function () {
				var scroll = $(window).scrollTop();
				if (scroll > stickyTop) {
					$(el).not(sticky).removeClass(st + "--on");
					if (!sticky.hasClass(st + "--on")) {
						sticky.addClass(st + "--on");
					}
				} else {
					sticky.removeClass(st + "--on");
				}
			});
		});
	},
	go_to: function () {
		"use strict";

		// Selecciona todos los links que tienen hash
		$('.go-to[href*="#"]')
			// Ignora los que no hacen nada
			.not('[href="#"]')
			.not('[href="#0"]')
			.click(function (event) {
				if (
					location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
					location.hostname == this.hostname
				) {
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
					if (target.length) {
						event.preventDefault();
						$('html, body').animate({
							scrollTop: target.offset().top
						}, 1000, function () {
							var $target = $(target);
							$target.attr('tabindex', '-1');
						});
					}
				}
			});
	},
	scroll_to: function (el, offset, duracion, callback) {
		var _target = $(el),
			_offset = 0,
			_duracion = 600,
			_move;

		if (offset) {
			_offset = offset;
		}

		if (duracion) {
			_duracion = duracion;
		}

		if(_target.length){
			clearTimeout(_move);

			_move = setTimeout(function () {
				$('html, body').animate({
					scrollTop: _target.offset().top + _offset
				}, _duracion);

				console.log(_target.offset().top + _offset);

				if (callback) {
					if (typeof callback === 'function') {
						callback();
					} else {
						console.log('"callback" debe ser del tipo function');
					}
				}
			}, 200);
		} else {
			console.warn("El target no existe");
		}
	},
	preloader: function (event) {
		var _preloader = $('#preloader-general');
		if (_preloader.length) {
			if (event) {
				_preloader.fadeIn('fast');
				setTimeout(function () {
					_preloader.addClass('activo');
				}, 10);
			} else {
				_preloader.addClass('activo');
				setTimeout(function () {
					_preloader.fadeOut('fast');
				}, 10);
			}
		} else {
			console.warn('Se debe crear el contenedor con el id "preloader-general"');
		}
	},
	formatear_miles: function (numero, antecesor) {
		"use strict";
		if (typeof (antecesor) == "undefined") {
			antecesor = "";
		}
		var str = new String(numero);
		var n = [];
		str = str.split("");
		count = Math.ceil(str.length / 3) - 1;
		for (i = str.length - 1; i >= 0; i -= 3) {
			num1 = str[i] ? str[i] : "";
			num2 = str[i - 1] ? str[i - 1] : "";
			num3 = str[i - 2] ? str[i - 2] : "";
			n[count] = num3 + num2 + num1;
			count--;
		}
		str = n.join(".");
		return antecesor + str;
	},
	obtener_numeros: function (valor, tipo) {
		var numero;
		if (tipo === 'string') {
			numero = valor.replace(/\D/g, '').toString();
		} else {
			numero = parseInt(valor.replace(/\D/g, ''));
		}
		return numero;
	},
	contiene_valor: function (container, value) {
		var returnValue = false;
		var pos = container.indexOf(value);
		if (pos >= 0) {
			returnValue = true;
		}
		return returnValue;
	},
	init: function () {
		"use strict";
		ars1.browsers();
		ars1.botones();
		ars1.alertas();
		ars1.tooltips();
		ars1.menu_desplegable();
		ars1.formularios();
		ars1.dividir_palabras();
		ars1.go_to();
		ars1.sticky(".sticky");
		if (typeof ars1.menu_responsive !== 'undefined') {
			$('.burger').click(function () {
				if (!$(this).hasClass('burger--activo')) {
					ars1.menu_responsive.abrir($(this), 'burger--activo');
				} else {
					ars1.menu_responsive.cerrar($(this), 'burger--activo');
				}
				return false;
			});
		}

		console.log("%c  ARS1 " + version + "  ", "background-image: linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%); color: #fff; font-size: 50px; font-weight:bold; padding: 5px 10px;");
	}
};

var ars1Lightbox = {
	creado: false,
	cerrado: true,
	modal: false,
	selector: '.lightbox',
	generar: function () {
		"use strict";
		$('html').css('overflow', 'hidden');
	},
	abrir: function (el) {
		"use strict";
		ars1Lightbox.cerrado = false;

		var id = $(el).attr('href');

		if (!ars1Lightbox.cerrado) {
			$('.lightbox--activo').removeClass('lightbox--activo').addClass('lightbox--hidden');
			ars1Lightbox.generar();
			$(ars1Lightbox.selector).find(id).removeClass('lightbox--hidden').addClass('lightbox--activo');
			$(ars1Lightbox.selector).fadeIn('fast');

			setTimeout(function () {}, 200);

			ars1Lightbox.creado = true;
		}
	},
	cerrar: function () {
		"use strict";
		if (ars1Lightbox.creado) {
			if (!ars1Lightbox.modal) {
				$('html').css('overflow', '');
				$(ars1Lightbox.selector).fadeOut('fast');
				setTimeout(function () {
					$(ars1Lightbox.selector).find('.lightbox--activo').removeClass('lightbox--activo').addClass('lightbox--hidden');
				}, 500);
			}
			ars1Lightbox.creado = false;
			ars1Lightbox.cerrado = true;
		}
	},
	init: function () {
		$('.abrir-lightbox').click(function () {
			// el lightbox recibe el atributo del href, el this es para decirle que de este elemento agarre ese atributo
			ars1Lightbox.abrir(this);
			return false;
		});
		$('.cerrar-lightbox').click(function () {
			ars1Lightbox.cerrar();
			return false;
		});
		$(document).keyup(function (e) {
			if (e.keyCode == 27) {
				ars1Lightbox.cerrar();
			}
		});
	}

};

/***************************************************
 * F U N C I O N E S
 * Aquí se encuentran las funciones  del sitio
 ****************************************************/


/***************************************************
 * E X T R A S
 * Aquí se encuentran eventos y llamados a librerías externas
 ****************************************************/

window.onload = function () {
	"use strict";
	document.body.classList.remove('loading');
};

ars1.init();
ars1Lightbox.init();


function tablas() {
	"use strict";
	$('.admin-content').find('table').each(function (i) {
		var clases = $(this).attr('class');
		if (!$(this).parent().hasClass('tabla')) {
			if (clases === 'undefined') {
				$(this).wrap('<div class="tabla"></div>');
			} else {
				$(this).wrap('<div class="tabla ' + clases + '"></div>');
			}
		}
		i++;
	}).parent().find('.tabla--responsive').each(function () {
		var _ths = {};
		$(this).find('th').each(function (i) {
			var _txt = $(this).text();
			_ths['th' + i] = _txt;
			i++;
		});
		$(this).find('tbody').each(function () {
			$(this).find('tr').each(function () {
				$(this).find('td').each(function (t) {
					$(this).attr('data-th', _ths['th' + t]);
				});
			});
		});
	}).parents('.tabla').find('table').each(function () {
		$(this).removeAttr('class');
	});
}

if (typeof tablas === 'function') {
	tablas();
}