var initMapa = function() {
	jQuery('.gmapa').each(function(){
		var lat = jQuery(this).attr('data-latitude');
		var lon = jQuery(this).attr('data-longitude');
		var zoom = parseInt(jQuery(this).attr('data-zoom'));
		if(lat != undefined && zoom != undefined && lon != undefined){
		 	var myLatlng = new google.maps.LatLng(lat,lon);
		    var mapOptions = {
		      center: myLatlng,
		      disableDoubleClickZoom: true,
		      zoomControlOptions: {
		        style: google.maps.ZoomControlStyle.SMALL
		      },
		      mapTypeControl:false,
		      streetViewControl: false,
		      zoom: zoom
		    };  
			var mapa = new google.maps.Map(jQuery(this).get(0),mapOptions);
		    var marker = new google.maps.Marker({
		      map: mapa,
		      position: new google.maps.LatLng(lat, lon),
		      animation: google.maps.Animation.DROP
		    });
		    
		    mapa.panTo(marker.getPosition());
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
window.onload = loadScriptMapa;