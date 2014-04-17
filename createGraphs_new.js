$(document).ready(function () {
    var limit = prompt("Please enter how many values: ", 20);
    var url = "http://ec2-54-187-18-145.us-west-2.compute.amazonaws.com/api/v1/datapoint/?limit=" + limit;
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
   }
   
	var pollutant = 'Particulate Matter';
	var yaxis = 'PM (ug/m^3)';
	var series = dylos1;
	
    $("#day").click(function () {
        limit = 40;
		console.log(limit);
        redraw();
    });

    $("#week").click(function () {
        limit = 120;
		console.log(limit);
        redraw();
    });
	
	$("#month").click(function ()	{
		limit = 360;
		console.log(limit);
		redraw();
	});

	$("#O3").click(function ()	{
		limit = 360;
		pollutant = 'Ozone';
		yaxis = 'O3 (ppm)';
		series = as3;
		redraw();
	});
	
	$("#PM").click(function ()	{
		limit = 360;
		pollutant = 'Particulate Matter'
		yaxis = 'PM (ug/m^3)';
		series = dylos1;
		redraw();
	});

	$("#NO2").click(function ()	{
		limit = 360;
		pollutant = 'Nitrogen Dioxide';
		yaxis = 'NO2 (ppm)'
		series = as1;
		redraw();
	});

	$("#NO").click(function ()	{
		limit = 360;
		pollutant = 'Nitrogen Oxide';
		yaxis = 'NO (ppt)'
		series = as7;
		redraw();
	});

	$("#CO").click(function ()	{
		limit = 360;
		pollutant = 'Carbon Monoxide';
		yaxis = 'CO (ppm)';
		series = as5;
		redraw();
		logger(index,value);
	});
	
function redraw() {
    function processJSON(data) {
        $.each(data.objects, logger);
        $('#container1').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: pollutant
            },

            yAxis: {
                title: {
                    text: yaxis
                }
            },
            series: [{
				name: yaxis,
				data: series
            }]
        });
        } 		

    // get the data
    $.getJSON(url, processJSON);
}

//initial 
redraw();


});
//OLD CODE
// var url = "http://ec2-54-201-87-182.us-west-2.compute.amazonaws.com/api/v1/datapoint/?limit=3";
// $.getJSON(url, function (data) {
// 	$.each(data.objects, function( index, value ) {
//   	console.log( index + ": " + value.temperature );
// 	});
// });