var serverNodesURL = "http://ec2-54-201-87-182.us-west-2.compute.amazonaws.com/api/v1/node/";
var serverDataURL = "http://ec2-54-201-87-182.us-west-2.compute.amazonaws.com/api/v1/datapoint/";

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
    		nodesDrawn = true;
		}
	});
}

console.log(sensors);