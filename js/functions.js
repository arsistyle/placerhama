function carta(tipo, active) {
  $.ajax({
    dataType: "json",
    url: '/json/carta-' + tipo + '.json',
    success: function (data) {
      var _header = $('.accordeon__header.oculto').clone();
      var _body = $('.accordeon__body.oculto').clone();
      var _item = $('.carta__item.oculto').clone();
      var _svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"> <line x1="10" y1="20" x2="10"/><line y1="10" x2="20" y2="10"/></svg>';

      $.each(data, function (i, grupo) {
        
        $('#js-carta-' + tipo + '').append(
          '<span class="accordeon__header" id="header-carta-' + i + '"><span>' + grupo.titulo + '</span>' + _svg + '</span>');
        $('#js-carta-' + tipo + '').append(
          '<div class="accordeon__body" id="body-carta-' + i + '">' +
          // Ver si existe la ruta de la imagen
          (grupo.imagen ? '<img src="' + grupo.imagen + '" alt="' + grupo.titulo + '" class="carta__imagen">' : "") +
          (grupo.descripcion ? '<h4 class="carta__descripcion ' + (grupo.imagen ? 'carta__descripcion--top' : '') + '">' + grupo.descripcion + '</h4>' : "") +
          '<div class="carta__lista">' +
          '</div>' +
          '</div>');

        $.each(grupo.platos, function (x, plato) {
          $('#body-carta-' + i).append(
            // Item
            '<div class="carta__item flex-xs column-xs row-md between-md" id="carta-item-' + x + '">' +
            // Info del item
            '<div class="carta__info">' +
            // Titulo del item
            '<h3 class="carta__nombre">' + (plato.id ? plato.id + ' - ' : "") + plato.titulo + (plato.personas ? ' <span>(' + plato.personas + ' per.)</span>' : "") + (plato.unidades ? ' <span>(' + plato.unidades + ' unid.)</span>' : "") + '</h3>' +
            // Descripción del item
            (plato.descripcion ? '<p class="carta__desc">' + plato.descripcion + '</p>' : "") +
            '</div>' +
            // Valor del item
            '<div class="carta__valor">' + plato.valor + '</div>' +
            '</div>');
        });
      });
      if (active && typeof active === "number") {
        $('#header-carta-' + active).addClass('active');
      }
      desplegar_carta();
    }
  });
}

if ($('body').hasClass('sushi')) {
  carta('sushi', 1);
} else if ($('body').hasClass('placer')) {
  carta('placer', 1);
}


function desplegar_carta() {
  var _mover;
  $('.accordeon__header').each(function (i, el) {
    var _this = $(this),
      _id_next = _this.next().attr('id');
    if (_this.hasClass('active')) {
      _this.next().show().addClass('active');
    }
    _this.click(function () {
      $('.accordeon__header').not(_this).removeClass('active');
      $('.accordeon__body').not(_this.next()).slideUp(600).removeClass('active');
      if (!_this.hasClass('active')) {
        _this.addClass('active').next().slideDown(600, function () {
          clearTimeout(_mover);
          _mover = setTimeout(function () {
            ars1.scroll_to('#' + _id_next, -50);
          }, 0);
        }).addClass('active');
      } else {
        _this.removeClass('active').next().slideUp(600).removeClass('active');
      }
    });
  });
}

var _map;

function initMap() {
  var _style,
    _icon;
  if ($('body').hasClass('sushi')) {
    _style = [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#c4c39d"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f7f7f0"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#ffffff"
          },
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#ffffff"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f7f7f0"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eaeaca"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
            "saturation": 36
          },
          {
            "color": "#333333"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f2f2f2"
          },
          {
            "lightness": 19
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#fefefe"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#fefefe"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      }
    ];
    _icon = '/img/sushi/marker.png';
  } else if ($('body').hasClass('placer')) {
    _style = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "saturation": 36
          },
          {
            "color": "#000000"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
          },
          {
            "color": "#000000"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 19
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
          },
          {
            "lightness": 17
          }
        ]
      }
    ];
    _icon = '/img/placer/marker.png';
  } else {
    _style = console.warn('Se debe agregar un estilo al mapa desde snazzymaps.com');
  }

  _map = new google.maps.Map(document.getElementById('js-mapa'), {
    zoom: 15,
    center: new google.maps.LatLng(-32.9331455, -71.5258544),
    mapTypeId: 'roadmap',
    styles: _style
  });

  var icons = {
    ubicacion: {
      icon: _icon
    }
  };

  var features = [{
    position: new google.maps.LatLng(-32.9331455, -71.5258544),
    type: 'ubicacion'
  }];

  // Create markers.
  features.forEach(function (feature) {
    var marker = new google.maps.Marker({
      position: feature.position,
      icon: icons[feature.type].icon,
      map: _map
    });
  });
}