$(document).ready(function() {

"use strict"; 
var output = [];
var table;

/** 
*** Carto DB Account Details
**/
var account_name = "philakeyspots";
var table = "keyspots";
var count = 1;
var data;
var numRows;
    
function getCount () { 
	var sql_statement = "SELECT cartodb_id,organization,site_address,region,site_type,st_y(the_geom) as lat, st_x(the_geom) as lng FROM " + table;
    $.getJSON("http://"+account_name+".cartodb.com/api/v2/sql/?q="+sql_statement, function(data) {
    }).done(function(data) {
    	makeLoop(data);
  });
}

function makeLoop (data) {
	numRows = data.rows.length;
	for (var i = 1, len = data.rows.length; i <= len; i++) {
		queryJusticeMap(data.rows[i], i);
	}
}

function queryJusticeMap (rowData, i) {
	var lat = rowData.lat;
	var lng = rowData.lng;
	$.getJSON("http://www.justicemap-api.org/api.php?fLat=" + lat + "&fLon=" + lng + "&sGeo=tract", function( jmData ) {
	}).done(function(jmData) {
		jmData.income = jmData.income.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		//Mapping
		/**

		L.marker([rowData.lat, rowData.lng]).addTo(map)
			.bindPopup("<b>" + rowData.organization + "</b><br />Income: $"+jmData.income).openPopup();
		**/

		//Send Data to Chart
		flatten_arrays(jmData, rowData);

	});
}

/**
*** Data cleaning happens here
**/



function flatten_arrays(jmData, rowData){

    //Clean up
    rowData.site_address = rowData.site_address.replace("Philadelphia PA", "");
	
	//Delete
	delete jmData.sClient;
	delete jmData.iExit;
	delete jmData.error;
	delete jmData.name10;
	delete rowData.lat;
	delete rowData.lng;
	delete rowData.cartodb_id;

	//Merge
	var fullSiteData = {};
	for (var attrname in rowData) {
		fullSiteData[attrname] = rowData[attrname]; 
	}
	for (attrname in jmData) {
		fullSiteData[attrname] = jmData[attrname];
	}
	output.push(fullSiteData);
	
	//Now that everything has been formatted sucessfully, increment the count
	count++;

	//Check that everything has been formatted
	if (numRows === count) {
			//Make it twice http://datatables.net/manual/tech-notes/3
	    	writeTable ("#example",output, true);
	    	writeTable ("#hover-result",output, false);
	    }
	    else {}
}

function writeTable (id, output, sortBoolean) {
	    $(id).dataTable( {
	        data: output,
	        paging: false,        
	        info:false,
	        sort:sortBoolean,
	        "columns": [
	            // CartoDB Data First
	            
	            
	            // CartoDB id forDebuggin
	            // { data: "cartodb_id" },
	            { data: "organization" },
	            { data: "site_address" },
	            { data: "site_type" },
	            { data: "region" },
	            
	            // Justice Income/Pop Data 
	            { data: "income" },
	            { data: "pop" },	

				// Justice Race Data
	            { data: "asian" },
	            { data: "black" },
	            { data: "hispanic" },
	            { data: "indian" },
	            { data: "island" },
	            { data: "multi"},
	            { data: "white"  },


	        ]
	    } );   
 
}

/**CartDB Viz **/

function main() {
        cartodb.createVis('carto-map', 'http://philakeyspots.cartodb.com/api/v2/viz/75f8c996-b86f-11e4-92ef-0e4fddd5de28/viz.json', {
            shareable: false,
            title: false,
            description: true,
            search: false,
            tiles_loader: true,
            fullscreen: false,
            legend: true,
            center_lat: 40,
            center_lon: -75.15,
            zoom: 12
        })
        .done(function(vis, layers) {
          // layer 0 is the base layer, layer 1 is cartodb layer
          // setInteraction is disabled by default
          layers[1].setInteraction(true);
          layers[1].on('featureOver', function(e, pos, latlng, data) {
            //cartodb.log.log(e, pos, latlng, data);
            search(data);
            
          });
          // you can get the native map to work with it
          var map = vis.getNativeMap();
          // now, perform any operations you need
          // map.setZoom(3);
          // map.panTo([50.5, 30.5]);
        })
        .error(function(err) {
          console.log(err);
        });
      }

  function search(data) {
  	var table = $('#hover-result').DataTable();
    if (data.organization) {
      $('#hover-result').removeClass('hover-result-hide');
      table.search(data.organization).draw();
    }
  }
main();
getCount();

})(jQuery);   