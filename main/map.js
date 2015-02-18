
  function initialize() {
  var phila = new google.maps.LatLng(40,-75.624207);
  var mapOptions = {
    zoom: 11,
    center: phila,
      legend: true
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var censusTractLayer = new google.maps.KmlLayer({
    url: 'http://www.maptile.org/tile/kml/income/42/101.kmz '
  });
 
 map.data.loadGeoJson("https://dl.dropboxusercontent.com/u/68432285/keyspots_addresses.json");
 censusTractLayer.setMap(map);
    
    
    map.data.addListener('mouseover', function(event) {
    document.getElementById('info-box').textContent =
        event.feature.getProperty('organization');
  });
    
}

google.maps.event.addDomListener(window, 'load', initialize);

