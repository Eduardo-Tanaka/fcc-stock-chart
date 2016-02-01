$(document).ready(function(){
    $(function () {
        var seriesOptions = [],
            seriesCounter = 0,
            codes = $("#codes").val(),
            names = codes.split(',');
        /**
         * Create the chart when all data is loaded
         * @returns {undefined}
         */
        function createChart() {
            $('#container').highcharts('StockChart', {                  
                rangeSelector: {
                    
                    selected: 4
                },

                yAxis: {
                    labels: {
                        formatter: function () {
                            return (this.value > 0 ? ' + ' : '') + this.value + '%';
                        }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }]
                },

                plotOptions: {
                    series: {
                        compare: 'percent'
                    }
                },

                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                    valueDecimals: 2
                },

                title: {
                    text: 'Stocks'
                },

                series: seriesOptions
            });
        }

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var day = now.getDate();
        var lastYear = new Date(year-1,month,day);
       
        if(names == "") {
            createChart();
            $(".stocks").append('<form action="/" method="post" id="form"><div id="stockBox" class="stock col-md-4"><div class="col-md-12"><h5 class="add">Syncs in realtime across clients</h5></div><div class="col-md-9"><input type="text" placeholder="Stock code" class="form-control" id="stock" name="stock"/></div><div class="col-md-1"><button type="button" id="addStock" class="btn btn-success">Add</button></div></div></form>')
            $("#addStock").on("click", function(){
                $('#alert').remove();
                $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/'+$("#stock").val()+'.json?api_key=RVVjoyPZwZGWcsCrWfGo', function(err, data) {
                    $("#form").submit();
                }).fail(function() {
                    $("#stockBox").append("<div class='col-md-12' id='alert'><p>Incorrect or not existing stock code</p></div>")
                });
            });
        } else {
            $.each(names, function (i, name) {
                $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/'+name+'.json?api_key=RVVjoyPZwZGWcsCrWfGo', function(data) {
                    var s = [];
                    s = data.dataset.data.reverse().map(function(d){
                        return [(new Date(d[0])).getTime(), d[1]];
                    })
                    $(".stocks").append('<div class="stock col-md-4"><a href="/delete/'+data.dataset.dataset_code+'" type="button" class="close"><span aria-hidden="true">&times;</span></a><h3>'+data.dataset.dataset_code+'</h3><p>'+data.dataset.name+'<p></div>')
                    seriesOptions[i] = {
                         name: name,
                        data: s,
                        pointStart: lastYear.getTime(),
                        pointInterval: 31536000
                    };

                    // As we're loading the data asynchronously, we don't know what order it will arrive. So
                    // we keep a counter and create the chart when all the data is loaded.
                    seriesCounter += 1;

                    if (seriesCounter === names.length) {
                        createChart();
                        $(".stocks").append('<form action="/" method="post" id="form"><div id="stockBox" class="stock col-md-4"><div class="col-md-12"><h5 class="add">Syncs in realtime across clients</h5></div><div class="col-md-9"><input type="text" placeholder="Stock code" class="form-control" id="stock" name="stock"/></div><div class="col-md-1"><button type="button" id="addStock" class="btn btn-success">Add</button></div></div></form>')
                        $("#addStock").on("click", function(){
                            $('#alert').remove();
                            $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/'+$("#stock").val()+'.json?api_key=RVVjoyPZwZGWcsCrWfGo', function(err, data) {
                                $("#form").submit();
                            }).fail(function() {
                                $("#stockBox").append("<div class='col-md-12' id='alert'><p>Incorrect or not existing stock code</p></div>")
                            });
                        });
                    }
                });
            });
        }
    });
});