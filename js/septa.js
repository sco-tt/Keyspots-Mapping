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
	var sql_statement = "SELECT cartodb_id,organization,site_address,region,site_type,st_y(the_geom) as lat, st_x(the_geom) as lon FROM " + table;
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
	var lon = rowData.lon;
	var url =  "http://www3.septa.org/hackathon/locations/get_locations.php?lon=" + lon + "&lat=" + lat + "&radius=.5&callback=?";

	$.ajax({
	  url: url,
	 dataType: "jsonp",
	  success: function(data){
	    $.each(data, function(i,item){
	        var locname =item.location_name;
	        if( item.location_type== 'bus_stops') {

	            if(item.location_data != null)
	             L.marker([item.location_lat, item.location_lon]).addTo(map)
					.bindPopup("<b>" + item.location_name + "</b><br />Distance: "+item.distance).openPopup();

	        }

	    });
	  }
	});
}


/**
*** Data cleaning happens here
**/



function flatten_arrays(septaData, rowData){

    //Clean up
    rowData.site_address = rowData.site_address.replace("Philadelphia PA", "");
	
	//Delete
	delete septaData.sClient;
	delete septaData.iExit;
	delete septaData.error;
	delete septaData.name10;
	delete rowData.lat;
	delete rowData.lon;
	delete rowData.cartodb_id;

	//Merge
	var fullSiteData = {};
	for (var attrname in rowData) {
		fullSiteData[attrname] = rowData[attrname]; 
	}
	for (attrname in septaData) {
		fullSiteData[attrname] = septaData[attrname];
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