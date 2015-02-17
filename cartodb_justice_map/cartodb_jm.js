$(document).ready(function() {

"use strict"; 
var output = [];

/** 
*** Carto DB Account Details
**/
var account_name = "philakeyspots";
var count;
var table = "keyspots";
    
function getCount () { 
  $("#output").addClass("spinning");
  var sql_statement = "SELECT count(*) FROM " + table;
    $.getJSON("http://"+account_name+".cartodb.com/api/v2/sql/?q="+sql_statement, function(data) {
    }).done(function(data) {
    	var count = data.rows[0].count;
        makeLoop(count);
  });
}

function makeLoop (count) {
	for (var i = 1, len = count; i <= len; i++) {
		queryCartoDB(count,i);
	}
}

function queryCartoDB(count,cartodb_id) {
	var sql_statement = "SELECT cartodb_id,organization,site_address,ST_AsGeoJSON(the_geom) as the_geom FROM " + table + " WHERE cartodb_id = '" + cartodb_id + "'";
	$.getJSON("http://"+account_name+".cartodb.com/api/v2/sql/?q="+sql_statement, function(cartoDbData) {
	}).done(function(cartoDbData) {
		console.log(cartoDbData);
		//Geo Data
		var geom = JSON.parse(cartoDbData.rows[0].the_geom);
		var lng = geom.coordinates[0];
		var lat = geom.coordinates[1];
		var queryURL = "http://www.justicemap-api.org/api.php?fLat=" + lat + "&fLon=" + lng + "&sGeo=tract";
		queryJusticeMap(queryURL, cartoDbData, count);
	});
}

function queryJusticeMap (queryURL, cartoDbData, count) {
	$.getJSON(queryURL, function( jmData ) {
	    flatten_arrays(jmData, cartoDbData, count);
	    
	});
}

/**
*** Data cleaning happens here
**/

function flatten_arrays(jmData, cartoDbData, count){
    var geoData = cartoDbData.rows[0];
    //Clean up
    geoData.site_address = geoData.site_address.replace("Philadelphia PA", "");
	jmData.income = jmData.income.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	
	//Delete
    delete geoData.the_geom;
	delete jmData.sClient;
	delete jmData.iExit;

	//Merge
	var fullSiteData = {};
	for (var attrname in geoData) {
		fullSiteData[attrname] = geoData[attrname]; 
	}
	for (var attrname in jmData) {
		fullSiteData[attrname] = jmData[attrname];
	}
	output.push(fullSiteData);


	//Up to now everything has been happenign on address at a time; now we check the lenght of of output array against the count
	if (output.length === count) {
	    	writeTable (output);
	    }
}

function writeTable (output) {
	  $("#output").removeClass("spinning");
	    $('#example').dataTable( {
	        data: output,
	        paging: false,
	        "columns": [
	            /** CartoDB Data First
	            ***
	            **/
	            
	            // CartoDB id forDebuggin
	            // { data: "cartodb_id" },
	            { data: "organization" },
	            { data: "site_address" },
	            
	            /**
	            *** Justice Map Data 
	            **/
	            
	            { data: "asian" },
	            { data: "black" },
	            { data: "error" },
	            { data: "hispanic" },
	            { data: "income" },
	            { data: "indian" },
	            { data: "island" },
	            { data: "multi"},
	            { data: "white"  },


	        ]
	    } );   

}

getCount();

})(jQuery);   