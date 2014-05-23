(function ($) {


  Drupal.behaviors.gmapa_field = {
    attach: function(context) {
      if(jQuery(context).context === undefined && jQuery(context).attr('id') == 'article-node-form' && 'google' in window ){
        tabela = jQuery('#edit-field-mapa .field-multiple-table tbody');
        initMapa(tabela);
      }
    }
  }
}) (jQuery);
// window.mapa = Array();
var initMapa = function(tabela) {
  if(tabela == undefined){
    tabela = jQuery('#edit-field-mapa .field-multiple-table tbody');
  }
  var trMapa = jQuery('<tr id="mapaWrapper" />'),
    tdMapa = jQuery('<td colspan="3" />'),
    mapaCanvas = jQuery('<div id="mapa_canvas" class="mapa_canvas" />');

  tdMapa.append(mapaCanvas);
  trMapa.append(tdMapa);
  tabela.append(trMapa);

    _mapa = jQuery('#mapa_canvas');
    inputEditar = jQuery("input.editarMapa");
    _valor = inputEditar.filter(':first').trigger('click').val();
      var map = {
        id: _valor,
        mapa: _mapa,
        lat: jQuery('#edit-field-mapa-und-' + _valor + '-longitude'),
        lgt: jQuery('#edit-field-mapa-und-' + _valor + '-latitude'),
        zoom: jQuery('#edit-field-mapa-und-' + _valor + '-zoom'),
        config: { 
          lat: -13.579376258290615, 
          lon: -52.873377799987736

        },
        mapaDiv: _mapa.get(0)
      };
        
    if(map.lat.val() != '' || map.lgt.val() != ''){
          map.config.lat = map.lat.val();
          map.config.lon = map.lgt.val();
    }
    var myLatlng = new google.maps.LatLng(map.config.lat,map.config.lon);
    var mapOptions = {
      center: myLatlng,
      disableDoubleClickZoom: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL
      },
      mapTypeControl:false,
      streetViewControl: false
    };
    if(map.zoom.val() == ''){
      mapOptions.zoom = 3;
    }
    else{
      mapOptions.zoom = parseInt(map.zoom.val());
    }
    map.mapa = new google.maps.Map(map.mapaDiv,mapOptions);
    map.marker = new google.maps.Marker({
      map: map.mapa,
      position: new google.maps.LatLng(map.config.lat, map.config.lon),
      draggable:true,
      animation: google.maps.Animation.DROP
    });
    map.zoom.val(map.mapa.getZoom());
    map.mapa.panTo(map.marker.getPosition());
    
    google.maps.event.addListener(map.marker, 'drag', function() {
      map.lat.get(0).value = map.marker.position.lat();
      map.lgt.get(0).value = map.marker.position.lng();
      var zoom = map.mapa.getZoom();
      map.zoom.val(zoom);
    });

    google.maps.event.addListener(map.mapa, 'zoom_changed', function() {
      var zoom = map.mapa.getZoom();
      map.zoom.val(zoom);
      window.setTimeout(function() {
          map.mapa.panTo(map.marker.getPosition());
      }, 1000);

      });
      
      google.maps.event.addListener(map.marker, 'mouseup', function() {
          window.setTimeout(function() {
              map.mapa.panTo(map.marker.getPosition());
          }, 700);
    });
    
    google.maps.event.addListener(map.mapa, 'dblclick', function(event) {
          if(map.marker === undefined){
              map.marker = new google.maps.Marker(f);
          }
          map.marker.setPosition(event.latLng);
          window.setTimeout(function() {
              map.mapa.panTo(map.marker.getPosition());
          }, 1000);
          map.lat.get(0).value = map.marker.position.lat();
          map.lgt.get(0).value = map.marker.position.lng();
    });
    
    window.mapa = map;    
    // inputEditar = jQuery("input.editarMapa");
    inputEditar.click(function(){
      if('mapa' in window){
        console.log(window.mapa);
        _valor = this.value;
        window.mapa.lat   = jQuery('#edit-field-mapa-und-' + _valor + '-longitude');
        window.mapa.lgt   = jQuery('#edit-field-mapa-und-' + _valor + '-latitude');
        window.mapa.zoom  = jQuery('#edit-field-mapa-und-' + _valor + '-zoom');
        if(window.mapa.lat.val() != '' || window.mapa.lgt.val() != ''){
          window.mapa.config.lat = window.mapa.lat.val();
          window.mapa.config.lon = window.mapa.lgt.val();
        }
        else{
          window.mapa.config.lat = -13.579376258290615;
          window.mapa.config.lon = -52.873377799987736;
        }
        var latLng = new google.maps.LatLng(window.mapa.config.lat,window.mapa.config.lon);

          window.mapa.marker.setPosition(latLng);
          window.setTimeout(function() {
              window.mapa.mapa.panTo(window.mapa.marker.getPosition());
          }, 1000);
          // window.mapa.lat.get(0).value = window.mapa.marker.position.lat();
          // window.mapa.lgt.get(0).value = window.mapa.marker.position.lng();
          // var zoom = map.mapa.getZoom();
          // map.zoom.val(zoom);
      }
    });
}
function loadScriptMapa() {
  if(window.scriptMapa === undefined){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
        'callback=initMapa';
    document.body.appendChild(script);

  }
}
window.iniciarMapa = initMapa;
window.onload = loadScriptMapa;