// In Front End

//TO DO:
//Fix timing - split into multiple threads
//Fix map bounds
//Fix hover area
//Add PM and Last updated
//Only get latest datapoint
//Differentiate inside vs. outside nodes
//Resize map when in corner
//Fix Attribution

var serverNodesURL = "http://ec2-54-186-224-108.us-west-2.compute.amazonaws.com/api/v1/node/"
//http://ec2-54-187-18-145.us-west-2.compute.amazonaws.com/api/v1/node/";
var serverDataURL = "http://ec2-54-186-224-108.us-west-2.compute.amazonaws.com/api/v1/datapoint/";

var sensors = [];
var new_sensor;
var nodesDrawn = false;
var update_int = 15000; //milliseconds

var mapBig = true;

var alpha1_thresholds = [100, 500, 900, 1300, 1500];
var alpha2_thresholds = [100, 500, 900, 1300, 1500];
var alpha3_thresholds = [100, 500, 900, 1300, 1500];
var alpha4_thresholds = [100, 500, 900, 1300, 1500];
var alpha_thresholds = [alpha1_thresholds, alpha2_thresholds, alpha3_thresholds, alpha4_thresholds];

function sensor(lat,lon,location) {
	this.lat = lat;
	this.lon = lon;
	this.location = location;
	this.alpha1 = null;
	this.alpha2 = null;
	this.alpha3 = null;
	this.alpha4 = null;
	this.color = 0; // 0 = green, 1 = yellow, 2 = orange, 3 = red
}

function RequestNodes() {
	$.getJSON(serverNodesURL, function (data) {
		for(i=0; i<data["objects"].length; i++){
			new_sensor = new sensor(data["objects"][i]["location"]["latitude"],data["objects"][i]["location"]["longitude"],data["objects"][i]["location"]["name"]);
    		sensors.push(new_sensor);
    		console.log("nodes Drawn is being set to true")
    		nodesDrawn = true;
		}
	});
	//while(!nodesDrawn){
		//wait
	//	}
	//RequestDatapoints();
}

function RequestDatapoints() {
	console.log("nodes Drawn is being read")
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


function displayHover(i){
	$("#locationheader").html("Location: "+String(sensors[i].location));
	$(".alpha1").html("Alphasense 1: "+String(sensors[i].alpha1));
	$(".alpha2").html("Alphasense 2: "+String(sensors[i].alpha2));
	$(".alpha3").html("Alphasense 3: "+String(sensors[i].alpha3));
	$(".alpha4").html("Alphasense 4: "+String(sensors[i].alpha4));
	$(".temp").html("Temperature: "+String(sensors[i].temp));
};

$(document).ready(function(){
	RequestNodes();
	var reset = setInterval(function() {RequestDatapoints()}, update_int);

    //Leaflet Map
    var googleLayer = new L.Google('ROADMAP');

	var sWBound = L.latLng(42.365901,-71.079440);
	var nEBound = L.latLng(42.350901,-71.107550);
	var map = new L.Map('map', {minZoom: 14, maxBounds:[sWBound,nEBound], zoomControl: false, layers: [googleLayer] });
	map.setView([42.359200, -71.091950], 16);

	map.addLayer(googleLayer);
	var zoomBar = L.control.zoom({ position: 'topleft' }).addTo(map);

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
	    		fillOpacity: 0.75
			}).addTo(map);
			

			sensors[i].circ.number = i;
	
			sensors[i].circ.bindPopup(sensors[i].location, {closeButton: false});
			sensors[i].circ.on('mouseover', function(evt) {
				evt.target.openPopup();
				displayHover(this.number);
			});
			sensors[i].circ.on('mouseout', function(evt){
				evt.target.closePopup();
			});

			sensors[i].circ.on('click', function(evt){
				moveMap();
			});

		};
	}

	var draw = setTimeout(function() {drawNodes()}, 500);
	//var pan = setTimeout(function() {map.panTo([30,-60])}, 2000);

	function moveMap(){
		if(mapBig){
			//map.setZoom(15);
			$("#map").animate({
				height: "200px",
				width: "400px"
			},750);
			mapBig = false;
			map.attributionControl.removeAttribution('Map data &copy CloudMade');
			map.removeControl(zoomBar);
			//map.panTo([42.35300, -71.083000]);
			//map.setZoom(15);
		}
	}

	$('#map').click(function(){
		if(!mapBig){
			$(this).animate({
					height: "450px",
					width: "70%"
				},750);
			mapBig = true;
			map.attributionControl.addAttribution('Map data &copy CloudMade');
			map.addControl(zoomBar);
			map.setView([42.359200, -71.091950], 16);
		}
	});

});
