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

cache = {
    'dylosBig':{},
    'dylosSmall':{},
    'no':{},
    'co':{},
    'no2':{},
    'o3':{}
}

baseURL = "http://clairity.mit.edu"
//baseURL = "http://localhost:8000";
var seriesOptions = [];

$(function() {
    var    yAxisOptions = [],
        names = ['dylos'],
        nodes = [],
        color = ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
        currentSensor;

    counter = 0;

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
                var long_name = '';
                switch(sensor){
                    case 'dylosSmall' : long_name='Small Particles'; break;
                    case 'dylosBig' : long_name='Big Particles'; break;
                    case 'no': long_name = 'NO'; break;
                    case 'no2': long_name = 'NO<sub>2</sub>'; break;
                    case 'co': long_name = 'CO'; break;
                    case 'o3': long_name = 'O<sub>3</sub>'; break;
                    default: long_name = 'Unknown';
                }

                displayError("Node "+node+" has no current data. (" + long_name + ')');
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

            $.each(nodes, function(num, nodeId){
                sensor = currentSensor
                if(cache[sensor].hasOwnProperty(nodeId)){
                    seriesOptions[seriesCounter] = {
                        name:nodeId,
                        data:cache[sensor][nodeId]
                    }
                    seriesCounter++;
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
        var url = baseURL+'/download/csv/?sensor=' + sensor + '&node_ids=' + nodes;
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
                labels: {
                    //formatter: function() {
                        //return (this.value > 0 ? '+' : '') + this.value + '%';
                    //}
                    align:'right',
                    style: {
                        whiteSpace: 'nowrap'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: 'silver'
                }]
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
