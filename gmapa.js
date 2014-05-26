(function ($) {
  Drupal.behaviors.gmapa_field = {
    attach: function(context) {
      if('mapa' in window){
        atualizarEdicao();
      }
    }
  }
}) (jQuery);
// window.mapa = Array();
var initMapa = function() {
  var mapaWrapper = jQuery('#mapaWrapper');
  if(mapaWrapper.length === 0){
    
      wrapper = jQuery('.field-type-gmapa-pos');
    
    mapaWrapper = jQuery('<div id="mapaWrapper" />');
    var mapaCanvas = jQuery('<div id="mapa_canvas" class="mapa_canvas" />');

    mapaWrapper.append(mapaCanvas);
    wrapper.append(mapaWrapper);

    _mapa = jQuery('#mapa_canvas');
    _mapaWrapper = jQuery('#mapaWrapper');
    inputEditar = jQuery("input.editarMapa");
    _valor = inputEditar.filter(':first').trigger('click').val();
    var map = {
      id: _valor,
      mapa: _mapa,
      wrapper: _mapaWrapper,
      lat: jQuery('.latitude-' +_valor),
      lgt: jQuery('.longitude-' + _valor),
      zoom: jQuery('.zoom-' + _valor),
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
      }, 500);
      map.lat.get(0).value = map.marker.position.lat();
      map.lgt.get(0).value = map.marker.position.lng();
    });
    
    window.mapa = map;
  }
  atualizarEdicao();
}
function atualizarEdicao(){
  var inputEditar = jQuery("input.editarMapa"),
    $formitem = inputEditar.filter(':first').parent('.editar');
    $formParent = $formitem.closest('.field-type-gmapa-pos'),
    _top = parseInt($formitem.offset().top),
    _topField = parseInt($formParent.offset().top),
    outerHeight =  $formParent.outerHeight();
    if('mapa' in window){
      window.mapa.wrapper.animate({top:_top-(_topField+8)},200);
    }
  inputEditar.click(function(){
    if('mapa' in window){
      var _valor = this.value;
      window.mapa.lat   = jQuery('.latitude-' + _valor);
      window.mapa.lgt   = jQuery('.longitude-' +_valor);
      window.mapa.zoom  = jQuery('.zoom-' + _valor);

      if(window.mapa.lat.val() != '' || window.mapa.lgt.val() != ''){
        window.mapa.config.lat = window.mapa.lat.val();
        window.mapa.config.lon = window.mapa.lgt.val();
        window.mapa.config.zoom = parseInt(window.mapa.zoom.val());
      }
      else{
        window.mapa.config.lat = -13.579376258290615;
        window.mapa.config.lon = -52.873377799987736;
        window.mapa.config.zoom = 3;
      }
      var latLng = new google.maps.LatLng(window.mapa.config.lat,window.mapa.config.lon);
      window.mapa.marker.setPosition(latLng);
      window.mapa.mapa.setZoom(window.mapa.config.zoom);
      window.mapa.mapa.panTo(window.mapa.marker.getPosition());
      // _top = parseInt(jQuery(this).offset().top);

      // window.mapa.wrapper.animate({top:_top-(_topField+28)},200);
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