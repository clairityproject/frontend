//export.js

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

$.xhrPool = [];
$.xhrPool.abortAll = function() {
    $(this).each(function(idx, jqXHR) {
        jqXHR.abort();
    });
    $.xhrPool.length = 0
};

$.ajaxSetup({
    beforeSend: function(jqXHR) {
        $.xhrPool.push(jqXHR);
    },
    complete: function(jqXHR) {
        var index = $.xhrPool.indexOf(jqXHR);
        if (index > -1) {
            $.xhrPool.splice(index, 1);
        }
    }
});

cache = {
    'dylosBig':{},
    'dylosSmall':{},
    'no':{},
    'co':{},
    'no2':{},
    'o3':{}
}

//baseURL = "http://clairity.mit.edu";
baseURL = "http://localhost:8000";
var seriesOptions = [];

var node_name = [{"node_id": "0", "name": "None"}, {"node_id": "1", "name": "MIT Museum"}, {"node_id": "2", "name": "Next House Dining"}, {"node_id": "3", "name": "Stratton Student Center"}, {"node_id": "4", "name": "CoGen Plant"}, {"node_id": "5", "name": "Burton Conner"}, {"node_id": "6", "name": "Media Lab"}, {"node_id": "7", "name": "Briggs Field"}, {"node_id": "8", "name": "Next House Courtyard"}, {"node_id": "9", "name": "Kresge Parking Lot"}, {"node_id": "10", "name": "Green Building Roof"}, {"node_id": "11", "name": "West Parking Garage"}, {"node_id": "12", "name": "Parsons Laboratory (Building 48)"}, {"node_id": "13", "name": "Cafe 4"}, {"node_id": "14", "name": "Facilities Vehicle"}, {"node_id": "15", "name": "Killian Court"}, {"node_id": "16", "name": "Building 16"}, {"node_id": "17", "name": "Mass Ave / Vassar Parking"}, {"node_id": "18", "name": "Building 1"}, {"node_id": "19", "name": "Broken Node"}, {"node_id": "20", "name": "Walker Memorial"}, {"node_id": "21", "name": "Green Building"}, {"node_id": "22", "name": "Stata Loading Dock"}, {"node_id": "23", "name": "Sloan School"}, {"node_id": "24", "name": "Tech Shuttle"}, {"node_id": "25", "name": "MIT Medical Parking"}]

$(function() {
    var    yAxisOptions = [],
        names = ['dylos'],
        nodes = [],
        color = ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
        currentSensor;

    counter = 0;

    function sensorName(shortCode){
        var long_name = '';
        switch(shortCode){
            case 'dylosSmall' : long_name='Fine Particles'; break;
            case 'dylosBig' : long_name='Coarse Particles'; break;
            case 'no': long_name = 'NO'; break;
            case 'no2': long_name = 'NO<sub>2</sub>'; break;
            case 'co': long_name = 'CO'; break;
            case 'o3': long_name = 'O<sub>3</sub>'; break;
            default: long_name = 'Unknown';
        }
        return long_name;
    }

    function getData(sensor, node){
        if(cache[sensor].hasOwnProperty(node)){
            processNodes()
            return
        }
        // download otherwise

        $.getJSON(baseURL + '/graph/all/?sensor=' + sensor + '&node_id=' + node,   function(data) {
            // add to cache
            cache[sensor][node] = data;

            if (data.length == 0){
                var long_name = sensorName(sensor);

                displayError("Node at " + node_name[node].name + " has no current data. (" + long_name + ')');
            }

            processNodes();
        });
    }


    function displayError(msg){

        $('#graph-area').prepend('<div class="alert alert-danger alert-dismissable">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                  msg +
                    '</div>');
    }

    function displayInfo(msg){

        $('#graph-area').prepend('<div class="alert alert-success alert-dismissable">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                  msg +
                    '</div>');
    }

    function downloadData(){
        // make sure all nodes have data

        $.each(nodes, function(i, id) {
            getData(currentSensor, id);
        });

        // check if empty
        if (nodes.length == 0){
            processNodes();
        }
    }

    function processNodes(){
            // drawing asycronously
            var seriesCounter = 0,
                drawNow = true
            seriesOptions = []
            chartTitle = ''

            $.each(nodes, function(num, nodeId){
                sensor = currentSensor
                if(cache[sensor].hasOwnProperty(nodeId)){
                    seriesOptions[seriesCounter] = {
                        name:node_name[nodeId].name,
                        data:cache[sensor][nodeId]
                    }
                    seriesCounter++;
                    chartTitle = (chartTitle.length == 0) ? sensorName(sensor) + " at " + node_name[nodeId].name : chartTitle + ", " + node_name[nodeId].name;
                }
                else{
                    drawNow = false
                }
            });
            if(nodes.length == 0)
                drawNow = false
            if (drawNow)
                createChart();
    }

    $('.btn-node').click(function(e){


        target = $(e.target)
        nodeId = target.attr('id') 
        if (target.hasClass('btn-default')){
            target.removeClass('btn-default')
            nodes.push(nodeId);
            target.addClass('btn-primary')
        } else {
            nodes.remove(nodeId)
            target.removeClass('btn-primary')
            target.addClass('btn-default')
        }
        downloadData();
    });

    $('#download-csv').click(function(e){
        // stop all active connections
        $.xhrPool.abortAll();
        if (nodes.length == 0 || currentSensor == undefined){
            console.log("asdfasdfa ");
            displayError("Please select a node and a sensor for which to download data.");
            return ;
        }
        displayInfo("Please wait. Generating and downloading CSV file. This may take a while.");
        var url = baseURL+'/download/csv/?sensor=' + currentSensor+ '&node_ids=' + nodes;
        window.location = url;
    });

    $('.btn-sensor').click(function(e){
        target = $(e.target)
        // remove all UI selections
        $.each($('.btn-sensor'), function(i, btn){
            btn = $(btn)
            if(btn.hasClass('btn-primary')){
                btn.removeClass('btn-primary');
                btn.addClass('btn-default');
            }
        });
        
        // select current
        target.removeClass('btn-default')
        target.addClass('btn-primary')

        // change currentSensor
        currentSensor = target.attr('id');
        downloadData();
    });


    //on-load, click at least one sensor type
    if($('.btn-sensor.btn-primary').length ==0 ){
        // select big particles
        $('#dylosBig').click();
    }

// create the chart when all data is loaded
function createChart() {

        $('#graph').highcharts('StockChart', {
            colors : color,
            rangeSelector : {
                buttons : [{
                    type     : 'hour',
                    count    : 1,
                    text     : '1h'
                }, {
                    type     : 'day',
                    count    : 1,
                    text     : '1D'
                }, {
                    type     : 'year',
                    count    : 1,
                    text     : '1y'
                }, {
                    type     : 'ytd',
                    text     : 'YTD'
                }, {
                    type     : 'all',
                    count    : 1,
                    text     : 'All'
                }],
                selected     : 4,
                inputEnabled : $('#graph').width() > 480
            },

            yAxis: {
                title: {
                    text: 'ozone'
                },
                labels: {
                    //formatter: function() {
                        //return (this.value > 0 ? '+' : '') + this.value + '%';
                    //}
                    align:'left',
                    style: {
                        whiteSpace: 'nowrap'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: 'silver'
                }],

                title : {text:chartTitle},
                //,
                //range:6000
            },
            
            plotOptions: {
                series: {
                    compare: 'value'
                }
            },
            
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },

            
            series: seriesOptions
        });
         
    }

});
