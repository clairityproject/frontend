// In Front End

//TO DO:
//fix colors
//don't show malfunctioning nodes
//Initial explanation - add EPA
//Fix concentration units placement
//Last updated - David will fix
//color legend
//Fix navbar

//For next Tuesday:
//Posters: bring laptop to connect to screen to project poster - bring Dongle ??????
//Bring towers
//Attire: don't wear anything not drastically blue, dress up (business casual)

//------------

//At some later date
//site label on graphs
//map: Buildings from whereis.mit.edu
//fix popup skip when click

//Note: changing the colors on the nodes to reflect only PM2.5, CO, and O3 with the data Derek emailed
//the numbers are in counts, and ppm (which is what we'll be using once things are calibrated)

var serverURL = "http://clairity.mit.edu/latest/all/";

var sensors = [];
var new_sensor;
var nodesDrawn = false;
var firstUpdate = true;
var update_int = 15000; //milliseconds, 15 seconds

var mapBig = true;

var alpha1_thresholds = [0, 4.5, 9.5]; //CO
var alpha2_thresholds = [100, 500, 900, 1300, 1500]; //NO
var alpha3_thresholds = [100, 500, 900, 1300, 1500]; //NO2
var alpha4_thresholds = [0, 0.065, 0.165]; //O3
var pm25_thresholds = [0, 300, 1050];
var pm10_thresholds = [100, 500, 900, 1300, 1500];
var alpha_thresholds = [alpha1_thresholds, alpha2_thresholds, alpha3_thresholds, alpha4_thresholds, pm25_thresholds, pm10_thresholds];

var drawNodes;

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
	this.color = [0,0,0,0,0,0,0]; 
	//Overall color, alpha1 color, alpha2 color, alpha3 color, alpha4 color, pm2.5 color, pm10 color
	// 0 = green, 1 = yellow, 2 = orange, 3 = red
	this.pm25 = null;
	this.pm10 = null;
	this.functioning = true;
}

function RequestNodes() {
	$.getJSON(serverURL, function (data) {
		if(!nodesDrawn){
			for(i=0; i<data.length; i++){
				new_sensor = new sensor(data[i]["latitude"],data[i]["longitude"],data[i]["name"],data[i]["node_id"],data[i]["indoor"]);
	    		sensors.push(new_sensor);
			}
			drawNodes();
			nodesDrawn=true;
		}
		if(nodesDrawn){
			for(i=0; i<sensors.length; i++){
				sensors[i].color = [0,0,0,0,0,0,0];
				for(j=1; j<7; j++){
					addAlphasenseData(i,j,data);
				}
				sensors[i].temp = data[i]["temperature"];
				sensors[i].rh = data[i]["rh"];
				var tempDate = data[i]["last_modified"].split(/[\s*\-\s*,":"]/,5);
				sensors[i].lastUpdated = tempDate[1]+"/"+tempDate[2]+"/"+tempDate[0]+" "+tempDate[3]+":"+tempDate[4];
				setColor(i);
			}
			if(firstUpdate){
				displaySidebar(14);
				sensors[14].circ.setStyle({fillOpacity: "1"});
				firstUpdate = false;
			}
		}
	});
}

function addAlphasenseData(i,j,data){
	if(j==1){
		var toAdd = data[i]["alphasense_1"];
		sensors[i].alpha1 = toAdd;
		findColor(i,1,toAdd);
	}
	else if(j==2){
		 var toAdd = data[i]["alphasense_2"];
		 sensors[i].alpha2 = toAdd;
	}
	else if(j==3){
		var toAdd = data[i]["alphasense_3"];
		sensors[i].alpha3 = toAdd;
	}
	else if(j==4){
		var toAdd = data[i]["alphasense_4"];
		sensors[i].alpha4 = toAdd;
		findColor(i,4,toAdd);
	}
	else if(j==5){
		if(data[i]["dylos_bin_1"]){
			var toAdd = data[i]["dylos_bin_1"]+data[i]["dylos_bin_2"]+data[i]["dylos_bin_3"];
			sensors[i].pm25 = toAdd;
			findColor(i,5,toAdd);
		}
	}
	else{
		if(data[i]["dylos_bin_4"]){
			var toAdd = data[i]["dylos_bin_4"];
			sensors[i].pm10 = toAdd;
		}
	}
}

function findColor(i, j, value) {
	if(value > alpha_thresholds[j-1][2]){ 
		sensors[i].color[j] = 2; 
	}
	else if(value > alpha_thresholds[j-1][1]){ 
		sensors[i].color[j] = 1; 
	}
}

function setColor(i){
	var circColor = null;
	if(sensors[i].lat){
		for(k=1;k<7;k++){
			if(sensors[i].color[k]>sensors[i].color[0]){
				sensors[i].color[0]=sensors[i].color[k];
			}
		}
		if(sensors[i].color[0] == 0){ circColor = "green"; }
		else if(sensors[i].color[0] == 1){ circColor = "yellow"; }
		else{ circColor = "red"; }
		sensors[i].circ.setStyle({color: circColor, fillColor: circColor});
	}
}

function displaySidebar(i){
	$("#locationheader").html(String(sensors[i].location));
	$(".alpha1").html(String(Math.round(sensors[i].alpha1))+" ppm");
	$(".alpha2").html(String(Math.round(sensors[i].alpha2))+" ppm");
	$(".alpha3").html(String(Math.round(sensors[i].alpha3))+" ppm");
	$(".alpha4").html(String(Math.round(sensors[i].alpha4))+" ppm");
	$(".pm25").html(String(Math.round(sensors[i].pm25))+" per 0.01 ft³");
	$(".pm10").html(String(Math.round(sensors[i].pm10))+" per 0.01 ft³");
	$("#lastupdated").html("Last Updated: "+sensors[i].lastUpdated);
};


$(document).ready(function(){
    //Leaflet Map 

	var googleLayer = new L.Google('ROADMAP',mapStylesArray);

	var sWBound = L.latLng(42.336976,-71.153984);
	var nEBound = L.latLng(42.381880,-71.052017);
	var map = new L.Map('map', {center: [42.3590000, -71.095500], zoom: 16, minZoom: 14, maxBounds:[sWBound,nEBound], zoomControl: false, attributionControl: false, layers: [googleLayer] });
	//map.setView([42.3590000, -71.095500], 16);

	map.addLayer(googleLayer);
	var zoomBar = L.control.zoom({ position: 'topright' }).addTo(map);
	var attribution = L.control.attribution({position: 'topright'}).addTo(map);

	//map.touchZoom.disable();
	//map.dragging.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

	drawNodes = function(){
	for(var i=0; i<sensors.length; i++){
		if(sensors[i].lat){
			var delt_lat = 0.00015;
			var delt_lon = 0.00028;
			if(sensors[i].indoor){
				sensors[i].circ = L.polygon([[sensors[i].lat+delt_lat,sensors[i].lon],[sensors[i].lat-delt_lat,sensors[i].lon+delt_lon],[sensors[i].lat-delt_lat,sensors[i].lon-delt_lon]],{
	    			color: 'red',
	    			fillColor: "#f03",
	    			fillOpacity: 0.5
				}).addTo(map);
				sensors[i].circ.bindPopup(sensors[i].location, {closeButton: false,'offset': L.point(-12,-15)});
			}
			else{
				sensors[i].circ = L.circle([sensors[i].lat,sensors[i].lon], 16, {
	    			color: 'red',
	    			fillColor: "#f03",
	    			fillOpacity: 0.5
				}).addTo(map);
				sensors[i].circ.bindPopup(sensors[i].location, {closeButton: false,'offset': L.point(0,-5)});
			}

			sensors[i].circ.number = i;

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
}
	
	RequestNodes();
	var reset = setInterval(function() {RequestNodes()}, update_int);
   
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
