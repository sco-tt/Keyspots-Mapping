$(document).ready(function() {

"use strict"; 
var output = [];

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
		L.marker([rowData.lat, rowData.lng]).addTo(map)
			.bindPopup("<b>" + rowData.organization + "</b><br />Income: $"+jmData.income).openPopup();

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
	    	writeTable (output);
	    }
	    else {}
}

function writeTable (output) {
	    $("#example").dataTable( {
	        data: output,
	        paging: false,
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


getCount();

})(jQuery);   