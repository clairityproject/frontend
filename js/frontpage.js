// In Front End

//My TO DO by Thursday:
//Fix PM once Derek determines what to do
//fix time delay of nodes
//Last updated
//don't show malfunctioning nodes
//Initial explanation
//Fix map bounds - when zooms, doesn't center
//concentration units - once David is done callibrating
//fix location margin

//Others
//color legend

//At some later date
//site label on graphs?????
//map: Buildings from whereis.mit.edu ?


var serverURL = "http://clairity.mit.edu/latest/all/";

var sensors = [];
var new_sensor;
var nodesDrawn = false;
var update_int = 15000; //milliseconds, 15 seconds

var mapBig = true;

var alpha1_thresholds = [100, 500, 900, 1300, 1500]; //CO
var alpha2_thresholds = [100, 500, 900, 1300, 1500]; //NO
var alpha3_thresholds = [100, 500, 900, 1300, 1500]; //NO2
var alpha4_thresholds = [100, 500, 900, 1300, 1500]; //O3
var pm25_thresholds = [100, 500, 900, 1300, 1500];
var pm10_thresholds = [100, 500, 900, 1300, 1500];
var alpha_thresholds = [alpha1_thresholds, alpha2_thresholds, alpha3_thresholds, alpha4_thresholds, pm25_thresholds, pm10_thresholds];

function sensor(lat,lon,location,id,in_out) {
	this.node_id = id;
	this.lat = lat;
	this.lon = lon;
	this.location = location;
	this.indoor = in_out;
	this.alpha1 = null;
	this.alpha2 = null;
	this.alpha3 = null;
	this.alpha4 = null;
	this.color = 0; // 0 = green, 1 = yellow, 2 = orange, 3 = red
	this.pm25 = null;
	this.pm10 = null;
}

function RequestNodes() {
	$.getJSON(serverURL, function (data) {
		if(!nodesDrawn){
			for(i=0; i<data.length; i++){
				new_sensor = new sensor(data[i]["latitude"],data[i]["longitude"],data[i]["name"],data[i]["node_id"],data[i]["indoor"]);
	    		sensors.push(new_sensor);
			}
			drawNodes();
			//console.log(sensors);
			nodesDrawn=true;
		}
		if(nodesDrawn){
			for(i=0; i<sensors.length; i++){
				sensors[i].color = 0;
				for(j=1; j<5; j++){
					addAlphasenseData(i,j,data);
				}
				sensors[i].temp = data[i]["temperature"];
				sensors[i].rh = data[i]["rh"];
				var tempDate = data[i]["last_modified"].split(/[\s*\-\s*,":"]/,5);
				sensors[i].lastUpdated = new Date(tempDate[0],tempDate[1],tempDate[2],tempDate[3],tempDate[4]);
			}
		}
	});
	setColor();
}

function addAlphasenseData(i,j,data){
	switch(j){
	case 1:
		var toAdd = data[i]["alphasense_1"];
		sensors[i].alpha1 = toAdd;
		findColor(i,toAdd);
	case 2:
		 var toAdd = data[i]["alphasense_2"];
		 sensors[i].alpha2 = toAdd;
		 findColor(i,toAdd);
	case 3:
		var toAdd = data[i]["alphasense_3"];
		sensors[i].alpha3 = toAdd;
		findColor(i,toAdd);
	case 4:
		var toAdd = data[i]["alphasense_4"];
		sensors[i].alpha4 = toAdd;
		findColor(i,toAdd);
	case 5:
		var toAdd = data[i]["pm25"];
		sensors[i].pm25 = toAdd;
		findColor(i,toAdd);
	case 6:
		var toAdd = data[i]["pm10"];
		sensors[i].pm10 = toAdd;
		findColor(i,toAdd);
		
	}
}

function findColor(i, value) {
	if(value > alpha_thresholds[0][3]){ 
		sensors[i].color = 3; 
	}
	else if(value > alpha_thresholds[0][2] && sensors[i].color < 2){ 
		sensors[i].color = 2; 
	}
	else if(value > alpha_thresholds[0][1] && sensors[i].color < 1){ 
		sensors[i].color = 1; 
	}
}

function setColor(){
	var circColor = null;
	for(i=0; i<sensors.length; i++){
	if(sensors[i].lat){
		if(sensors[i].color == 0){ circColor = "green"; }
		else if(sensors[i].color == 1){ circColor = "yellow"; }
		else if(sensors[i].color == 2){ circColor = "orange"; }
		else{ circColor = "red"; }
		sensors[i].circ.setStyle({color: circColor, fillColor: circColor});
	}
	}
}

function displaySidebar(i){
	$("#locationheader").html(String(sensors[i].location));
	$(".alpha1").html(String(Math.round(sensors[i].alpha1)));
	$(".alpha2").html(String(Math.round(sensors[i].alpha2)));
	$(".alpha3").html(String(Math.round(sensors[i].alpha3)));
	$(".alpha4").html(String(Math.round(sensors[i].alpha4)));
	$("#lastupdated").html("Last Update: "+sensors[i].lastUpdated);
};

function drawNodes(){
	console.log("Drawing Nodes...");
	for(var i=0; i<sensors.length; i++){
		if(sensors[i].lat){
			var delt_lat = 0.00015;
			var delt_lon = 0.00028;
			if(sensors[i].indoor){
				console.log("Sensor is indoors");
				sensors[i].circ = L.polygon([[sensors[i].lat+delt_lat,sensors[i].lon],[sensors[i].lat-delt_lat,sensors[i].lon+delt_lon],[sensors[i].lat-delt_lat,sensors[i].lon-delt_lon]],{
	    			color: 'red',
	    			fillColor: "#f03",
	    			fillOpacity: 0.5
				}).addTo(map);
			}
			else{
				console.log("sensor is outdoors");
				console.log(sensors[i].lat+" "+sensors[i].lon);
				var placement = [42.361995,-71.097513];
				cirlce = L.circle(placement,16).addTo(map);
				console.log("circle placed");
				sensors[i].circ = L.circle(placement, 16, {
	    			color: 'red',
	    			fillColor: "#f03",
	    			fillOpacity: 0.5
				}).addTo(map);
				console.log("sensor added to map");
			}

			sensors[i].circ.number = i;

			sensors[i].circ.bindPopup(sensors[i].location, {closeButton: false,'offset': L.point(0,-5)});
			sensors[i].circ.on('mouseover', function(evt) {
				evt.target.openPopup();
			});
			sensors[i].circ.on('mouseout', function(evt){
				evt.target.closePopup();
			});

			sensors[i].circ.on('click', function(evt){
				displaySidebar(this.number);
				for(var i=0; i<sensors.length; i++){
					if(sensors[i].lat){
					sensors[i].circ.setStyle({fillOpacity: "0.5"});
					}
				}
				this.setStyle({fillOpacity: "1"});
			});

		};
	};
	console.log("Nodes Drawn!");
}


$(document).ready(function(){
    //Leaflet Map 

	var googleLayer = new L.Google('ROADMAP',mapStylesArray);

	var sWBound = L.latLng(42.365901,-71.079440);
	var nEBound = L.latLng(42.350901,-71.207550);
	var map = new L.Map('map', {center: [42.3590000, -71.095500], zoom: 16, minZoom: 14, maxBounds:[sWBound,nEBound], zoomControl: false, attributionControl: false, layers: [googleLayer] });
	//map.setView([42.3590000, -71.095500], 16);

	map.addLayer(googleLayer);
	var zoomBar = L.control.zoom({ position: 'topright' }).addTo(map);
	var attribution = L.control.attribution({position: 'topright'}).addTo(map);

	map.touchZoom.disable();
	map.dragging.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

	
	RequestNodes();
	//drawNodes();
	//var reset = setInterval(function() {RequestNodes()}, update_int);

   
	var mapBig = true;

	function moveMap(){
		if(mapBig){
			$("#graphcontainer").css("visibility","visible","height","400px","width","95%");
			$("#valuesTable").css("visibility","hidden");
			mapBig = false;
			map.removeControl(zoomBar);
		}
	}

	$('#map').click(function(){
		if(!mapBig){
			$("#graphcontainer").css("visibility","initial","height","0px","width","0px");
			mapBig = true;
		}
	});

});
