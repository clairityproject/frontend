// In Front End

//TO DO:
//Fix map bounds
//Last updated
//Only get latest datapoint
//Differentiate inside vs. outside nodes
//Fix Attribution
//map: Buildings from whereis.mit.edu ?

var serverNodesURL = "http://ec2-54-186-224-108.us-west-2.compute.amazonaws.com/api/v1/node/"
//http://ec2-54-187-18-145.us-west-2.compute.amazonaws.com/api/v1/node/";
var serverDataURL = "http://ec2-54-187-18-145.us-west-2.compute.amazonaws.com/api/v1/datapoint/";

var sensors = [];
var new_sensor;
var nodesDrawn = false;
var update_int = 15000; //milliseconds

var mapBig = true;

var alpha1_thresholds = [100, 500, 900, 1300, 1500];
var alpha2_thresholds = [100, 500, 900, 1300, 1500];
var alpha3_thresholds = [100, 500, 900, 1300, 1500];
var alpha4_thresholds = [100, 500, 900, 1300, 1500];
var pm25_thresholds = [100, 500, 900, 1300, 1500];
var pm10_thresholds = [100, 500, 900, 1300, 1500];
var alpha_thresholds = [alpha1_thresholds, alpha2_thresholds, alpha3_thresholds, alpha4_thresholds, pm25_thresholds, pm10_thresholds];

function sensor(lat,lon,location,id) {
	this.node_id = id;
	this.lat = lat;
	this.lon = lon;
	this.location = location;
	this.alpha1 = null;
	this.alpha2 = null;
	this.alpha3 = null;
	this.alpha4 = null;
	this.color = 0; // 0 = green, 1 = yellow, 2 = orange, 3 = red
	this.pm25 = null;
	this.pm10 = null;
	
}
/*
sensors.push(new sensor(17,"Building 48"));
sensors.push(new sensor(16,"Building 16"));
sensors.push(new sensor(15,"Killian Court"));
sensors.push(new sensor(20,"Walker Memorial"));
sensors.push(new sensor(23,"Sloan School"));
sensors.push(new sensor(21,"GB Base"));
sensors.push(new sensor(4,"Cogen"));
*/

function RequestNodes() {
	$.getJSON(serverNodesURL, function (data) {
		for(i=0; i<data["objects"].length; i++){
			new_sensor = new sensor(data["objects"][i]["location"]["latitude"],data["objects"][i]["location"]["longitude"],data["objects"][i]["location"]["name"]);
    		sensors.push(new_sensor);
    		nodesDrawn = true;
		}
	});
}

function RequestDatapoints() {
	if(nodesDrawn){
		$.getJSON(serverDataURL, function (data) {
			for(i=0; i<data["objects"].length; i++){
				sensors[i].color = 0;
				for(j=1; j<5; j++){
					addAlphasenseData(i,j,data);
				}
				sensors[i].temp = data["objects"][i]["temperature"];
				sensors[i].rh = data["objects"][i]["rh"];
			}
			setColor();
		});
	}
}

function addAlphasenseData(i,j,data){
	switch(j){
	case 1:
		var toAdd = data["objects"][i]["alphasense_1"];
		sensors[i].alpha1 = toAdd;
		findColor(i,toAdd);
	case 2:
		 var toAdd = data["objects"][i]["alphasense_2"];
		 sensors[i].alpha2 = toAdd;
		 findColor(i,toAdd);
	case 3:
		var toAdd = data["objects"][i]["alphasense_3"];
		sensors[i].alpha3 = toAdd;
		findColor(i,toAdd);
	case 4:
		var toAdd = data["objects"][i]["alphasense_4"];
		sensors[i].alpha4 = toAdd;
		findColor(i,toAdd);
	case 5:
		var toAdd = data["objects"][i]["pm25"];
		sensors[i].pm25 = toAdd;
		findColor(i,toAdd);
	case 6:
		var toAdd = data["objects"][i]["pm10"];
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
		if(sensors[i].color == 0){ circColor = "green"; }
		else if(sensors[i].color == 1){ circColor = "yellow"; }
		else if(sensors[i].color == 2){ circColor = "orange"; }
		else{ circColor = "red"; }
		sensors[i].circ.setStyle({color: circColor, fillColor: circColor});
	}
}


function displaySidebar(i){
	$("#locationheader").html(String(sensors[i].location));
	$(".alpha1").html(String(sensors[i].alpha1));
	$(".alpha2").html(String(sensors[i].alpha2));
	$(".alpha3").html(String(sensors[i].alpha3));
	$(".alpha4").html(String(sensors[i].alpha4));
	$(".temp").html(String(sensors[i].temp));
	$(".rh").html(String(sensors[i].rh));
	
};


$(document).ready(function(){
	RequestNodes();
	var reset = setInterval(function() {RequestDatapoints()}, update_int);

    //Leaflet Map
    var googleLayer = new L.Google('ROADMAP',mapStylesArray);

	var sWBound = L.latLng(42.365901,-71.079440);
	var nEBound = L.latLng(42.350901,-71.107550);
	var map = new L.Map('map', {minZoom: 14, maxBounds:[sWBound,nEBound], zoomControl: false, attributionControl: false, layers: [googleLayer] });
	map.setView([42.359900, -71.095000], 16);

	map.addLayer(googleLayer);
	var zoomBar = L.control.zoom({ position: 'topleft' }).addTo(map);
	var attribution = L.control.attribution({position: 'topright'}).addTo(map);


	map.touchZoom.disable();
	map.dragging.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

	//Nodes
	function drawNodes(){
		for(var i=0; i<sensors.length; i++){
			sensors[i].circ = L.circle([sensors[i].lat,sensors[i].lon], 16, {
	    		color: 'red',
	    		fillColor: "#f03",
	    		fillOpacity: 0.5
			}).addTo(map);

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
					sensors[i].circ.setStyle({fillOpacity: "0.5"});
				}
				this.setStyle({fillOpacity: "1"});
			});

		};
	}

	var draw = setTimeout(function() {drawNodes()}, 500);

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
