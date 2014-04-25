	var limit = 200;
	var url = "http://clairity.mit.edu/api/v1/datapoint/?limit=" + limit;
    var dylos1 = [];
	var dylos2 = [];
	var dylos3 = [];
	var dylos4 = [];
	var as1 = [];
	var as2 = [];
	var as3 = [];
	var as4 = [];
	var as5 = [];
	var as6 = [];
	var as7 = [];
	var as8 = [];
	var node = [];
	
	var NO_zeros = new Array();
	NO_zeros[0] = [285, 278, 282, 278, 282, 281, 294, 284, 293, 270, 290, 290, 290, 290, 277, 272, 276, 283, 289, 291, 276, 276, 280, 293, 275];
	NO_zeros[1] = [384, 377, 369, 366, 396, 390, 405, 387, 391, 377, 408, 375, 387, 407, 363, 384, 387, 383, 393, 383, 361, 380, 376, 388, 386];
	NO_zeros[2] = [298, 273, 272, 263, 275, 280, 277, 290, 259, 284, 279, 278, 274, 286, 292, 288, 286, 272, 288, 277, 282, 286, 287, 276, 285];
	NO_zeros[3] = [376, 352, 342, 328, 355, 362, 350, 368, 360, 366, 356, 342, 349, 363, 354, 363, 354, 347, 357, 342, 351, 359, 358, 357, 360];
	NO_zeros[4] = [672, 628, 708, 683, 664, 715, 726, 675, 660, 663, 713, 686, 648, 693, 678, 645, 604, 675, 607, 622, 688, 706, 727, 657, 645];
	NO_zeros[5] = [0.546, 0.538, 0.502, 0.566, 0.531, 0.572, 0.581, 0.54, 0.528, 0.53, 0.57, 0.549, 0.518, 0.554, 0.542, 0.528, 0.483, 0.54, 0.486, 0.498, 0.55, 0.565, 0.582, 0.526, 0.516];

	var O3_zeros = new Array();
	O3_zeros[0] = [335, 329, 355, 337, 327, 355, 347, 346, 356, 341, 350, 331, 345, 340, 342, 339, 351, 324, 345, 340, 332, 355, 350, 343, 339];
	O3_zeros[1] = [345, 364, 393, 358, 346, 358, 365, 368, 368, 348, 368, 340, 365, 373, 359, 352, 377, 335, 353, 355, 344, 375, 368, 354, 371];
	O3_zeros[2] = [347, 336, 361, 341, 329, 341, 330, 332, 343, 330, 324, 356, 341, 340, 342, 331, 345, 330, 332, 337, 326, 350, 344, 357, 354];
	O3_zeros[3] = [359, 366, 391, 365, 349, 336, 352, 355, 357, 340, 341, 359, 354, 374, 360, 350, 373, 340, 342, 357, 340, 363, 365, 373, 385,];
	O3_zeros[4] = [-421, -531, -468, -488, -512, -489, -491, -487, -484, -476, -505, -435, -495, -492, -523, -469, -497, -456, -507, -441, -455, -494, -439, -366, -546];
	
	var NO2_zeros = new Array();
	NO2_zeros[0] = [345, 364, 393, 358, 346, 358, 365, 368, 368, 348, 368, 340, 365, 373, 359, 352, 377, 335, 353, 355, 344, 375, 368, 354, 371];
	NO2_zeros[1] = [233, 224, 232, 218, 232, 227, 220, 232, 242, 245, 236, 224, 241, 238, 232, 207, 226, 227, 220, 225, 229, 247, 227, 235, 243];
	NO2_zeros[2] = [243, 234, 231, 251, 214, 233, 244, 230, 231, 239, 234, 228, 247, 222, 226, 224, 232, 222, 230, 222, 235, 232, 222, 222, 237];
	NO2_zeros[3] = [243, 221, 225, 238, 198, 230, 228, 227, 224, 236, 231, 220, 240, 214, 215, 217, 232, 214, 222, 213, 231, 213, 217, 227, 233];
	NO2_zeros[4] = [-546, -348, -344, -338, -353, -373, -429, -363, -392, -528, -380, -383, -331, -332, -360, -362, -540, -427, -319, -312, -398, -348, -335, -487, -342, -306];
	NO2_zeros[5] = [0.399, 0.254, 0.251, 0.247, 0.258, 0.272, 0.313, 0.265, 0.286, 0.385, 0.277, 0.28, 0.242, 0.242, 0.263, 0.264, 0.394, 0.312, 0.233, 0.228, 0.291, 0.254, 0.245, 0.356, 0.25, 0.223];
	
	var CO_zeros = new Array();
	CO_zeros[0] = [233, 224, 232, 218, 232, 227, 220, 232, 242, 245, 236, 224, 241, 238, 232, 207, 226, 227, 220, 225, 229, 247, 227, 235, 243];
	CO_zeros[1] = [360, 372, 360, 358, 342, 350, 358, 370, 346, 362, 354, 358, 363, 365, 356, 365, 354, 359, 367, 352, 356, 368, 368, 372, 370];
	CO_zeros[2] = [345, 346, 341, 341, 351, 360, 359, 350, 349, 348, 336, 342, 349, 333, 341, 349, 351, 353, 350, 341, 342, 347, 340, 332, 342];
	CO_zeros[3] = [332, 323, 322, 315, 328, 333, 328, 334, 328, 325, 313, 320, 333, 310, 325, 325, 328, 335, 335, 321, 325, 320, 320, 313, 320];
	CO_zeros[4] = [553, 494, 505, 530, 525, 562, 531, 511, 526, 508, 538, 532, 521, 523, 561, 562, 521, 512, 560, 547, 541, 555, 565, 568, 541];
	CO_zeros[5] = [0.442, 0.395, 0.404, 0.424, 0.42, 0.45, 0.425, 0.409, 0.421, 0.406, 0.43, 0.426, 0.417, 0.418, 0.449, 0.45, 0.417, 0.41, 0.448, 0.438, 0.433, 0.444, 0.452, 0.454, 0.433];
	
    function logger(index, value) {
        //console.log(index + ": " + value.temperature);
        dylos1.push(value.dylos_bin_1);
		dylos2.push(value.dylos_bin_2);
		dylos3.push(value.dylos_bin_3);
		dylos4.push(value.dylos_bin_4);
		as1.push(value.alphasense_1);
		as2.push(value.alphasense_2);
 		as3.push(value.alphasense_3);
		as4.push(value.alphasense_4);
		as5.push(value.alphasense_5);
		as6.push(value.alphasense_6);
		as7.push(value.alphasense_7);
		as8.push(value.alphasense_8);
		node.push(value.node_id);
   }

var pollutant = 'Ozone';
var yaxis = 'Ozone (ppm)'
var set = as3;
var mset = set;

//    var limit = prompt("Please enter how many values: ", 20);
	var limit = 413;

    $("#month").click(function () {
        limit = 400;
		set = mset.slice(0,400);
        redraw();
    });

    $("#day").click(function () {
        limit = 100;
 		set = mset.slice(0,100);
       redraw();
    });
	
	$("#week").click(function ()	{
		limit = 200;
		set = mset.slice(0,200);
		redraw();
	});
	
	$("#O3").click(function ()	{
		limit = 400;
		pollutant = 'Ozone'
		url = "http://clairity.mit.edu/api/v1/datapoint/?limit=" + limit;
		as3 = [];
		function logger(index, value) {
			as3.push(value.alphasense_3);
	   }
		yaxis = 'Ozone (ppm)'
		set = as3;
		console.log(set);
		mset = set;
		redraw();
	});
	
	$("#PM").click(function ()	{
		limit = 400;
		pollutant = 'Particulate Matter'
		url = "http://clairity.mit.edu/api/v1/datapoint/?limit=" + limit;
		dylos1 = [];
		function logger(index, value) {
			dylos1.push(value.dylos_bin_1);
	   }
	   yaxis = 'PM (ug/m^3)'
		set = dylos1;
		mset = set;
		redraw();
	});
	
	$("#NO2").click(function ()	{
		limit = 400;
		pollutant = 'Nitrogen Dioxide'
		url = "http://clairity.mit.edu/api/v1/datapoint/?limit=" + limit;
		as1 = [];
		function logger(index, value) {
			as1.push(value.alphasense_1);
	   }
	   yaxis = 'NO2 (ppm)'
		set = as1;
		mset = set;
		redraw();
	});
	
	$("#NO").click(function ()	{
		limit = 400;
		pollutant = 'Nitric Oxide'
		url = "http://clairity.mit.edu/api/v1/datapoint/?limit=" + limit;
		as7 = [];
		function logger(index, value) {
			as7.push(value.alphasense_7);
	   }
	   yaxis = 'NO (ppm)'
		set = as7;
		mset = set;
		redraw();
	});
	
	$("#CO").click(function ()	{
		limit = 400;
		pollutant = 'Carbon Monoxide'
		url = "http://clairity.mit.edu/api/v1/datapoint/?limit=" + limit;
		as5 = [];
		function logger(index, value) {
			as5.push(value.alphasense_5);
	   }
	   yaxis = 'CO (ppm)'
		set = as5;
		mset = set;
		redraw();
	});

function redraw() {
    function processJSON(data) {
        $.each(data.objects, logger);
        $('#container1').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },

            yAxis: {
                title: {
                    text: yaxis
                }
            },
            series: [{
				name: pollutant,
				data: set
            }]
        });  		
		}

    // get the data
    $.getJSON(url, processJSON);
}


$(document).ready(function () {
	$('#toGraph').click(function() {
		$('#map').fadeOut();
		$('#valuesTable').fadeOut(redraw);
		$('#graphContainer').fadeIn(redraw());
	});
	
	$('#backToMap').click(function() {
		$('#graphContainer').fadeOut();
		$('#map').fadeIn();
		$('#valuesTable').fadeIn();
	});
	
});

