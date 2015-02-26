// create a map
map = new L.Map('map');

// create the OpenStreetMap layer
osmTile = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
osmCopyright = "Map data &copy; 2012 OpenStreetMap contributors";
osmLayer = new L.TileLayer(osmTile, { maxZoom: 18, attribution: osmCopyright } );
map.addLayer(osmLayer);

// set the map's starting view
map.setView( new L.LatLng(40, -75.2), 11 );

// include GeoJSON inside this JavaScript
		function onEachFeature(feature, layer) {
            var popupContent = "<p>Route: " +
					feature.properties.name;

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			layer.bindPopup(popupContent);
		}



L.geoJson(septa, {
    onEachFeature: onEachFeature
}).addTo(map);
map.dragging.enable() 
