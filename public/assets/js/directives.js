var directivesModule = angular.module('zaApp.Directives', []);

/**
 * Helper Functions
 */
var LINE_CHART_MAIN_COLOR = "rgba(34,186,160,1)";
var LINE_CHART_SUB_COLOR = "rgba(220,220,220,1)";

function getLineChartData(_data, _label, _color){
    return [
        {
            // Draw the line chart
            data: _data,
            label: _label,
            color: _color,
            lines: {
                show: true,
                fill: 0.2
            },
            shadowSize: 0
        },
        {
            // Draw the dots
            data: _data,
            color: "#fff",
            lines: {
                show: false
            },
            curvedLines: {
                apply: false
            },
            points: {
                show: true,
                fill: true,
                radius: 4,
                fillColor: _color,
                lineWidth: 2
            },
            shadowSize: 0
        }
    ]
}
function getArrayOfArraysForLineChart(arrayOfObjects, property1, property2, isProperty1DateTime){
    var res = [];
    if (isProperty1DateTime){
        for (var i = 0; i< arrayOfObjects.length; i++) {
            var object = arrayOfObjects[i];
            var thisDate = new Date(object[property1]);
            var thisDateString = moment(thisDate).format("YYYY-MM-DD");
            thisDate = new Date(thisDateString);
            var row = [thisDate.getTime(), object[property2]];
            res.push(row);
        }
        return res;
    }
    else {
        for (var i = 0; i< arrayOfObjects.length; i++) {
            var object = arrayOfObjects[i];
            var row = [object[property1], object[property2]];
            res.push(row);
        }
        return res;
    }
}

function drawLineChart(elementSelector, dataset){
    if($(elementSelector).length)
    {
        var plot1 = $.plot($(elementSelector), dataset, {
            series: {
                color: "#14D1BD",
                lines: {
                    show: true,
                    fill: 0.2
                },
                shadowSize: 0,
                curvedLines: {
                    apply: true,
                    active: true
                }
            },
            xaxis: {
                mode: "time",
                timeformat: "%b %d",
                minTickSize: [1, "day"]
            },
            legend: {
                show: true
            },
            grid: {
                color: "#AFAFAF",
                hoverable: true,
                borderWidth: 0,
                backgroundColor: '#FFF'
            }
        });

        function showTooltip(x, y, contents) {
            $('<div id="chart-tooltip">' + contents + '</div>').css( {
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#dfeffc',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $(elementSelector).bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#chart-tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    var readableDate = moment(Number(x)).format("YYYY-MM-DD");
                    if (!!item.series.label){
                        showTooltip(item.pageX, item.pageY,
                            item.series.label + " on " + readableDate + " = " + y);
                    }
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }

}

directivesModule.directive('reportingDashboardSummary', ['$http', function($http){
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-dashboard-summary.html',
        link: function(scope, element, attrs){
            scope.users = [
                {
                    "pageviews": 300,
                    "date": "2015-08-01"
                },
                {
                    "pageviews": 450,
                    "date": "2015-08-02"
                },
                {
                    "pageviews": 380,
                    "date": "2015-08-03"
                },
                {
                    "pageviews": 135,
                    "date": "2015-08-04"
                },
                {
                    "pageviews": 278,
                    "date": "2015-08-05"
                },
                {
                    "pageviews": 175,
                    "date": "2015-08-06"
                },
                {
                    "pageviews": 300,
                    "date": "2015-08-07"
                },
                {
                    "pageviews": 370,
                    "date": "2015-08-08"
                },
                {
                    "pageviews": 224,
                    "date": "2015-08-09"
                },
                {
                    "pageviews": 90,
                    "date": "2015-08-10"
                }
            ];

            scope.sessions = [
                {
                    "sessions": 13,
                    "date": "2015-08-01"
                },
                {
                    "sessions": 83,
                    "date": "2015-08-02"
                },
                {
                    "sessions": 44,
                    "date": "2015-08-03"
                },
                {
                    "sessions": 33,
                    "date": "2015-08-04"
                },
                {
                    "sessions": 78,
                    "date": "2015-08-05"
                },
                {
                    "sessions": 55,
                    "date": "2015-08-06"
                },
                {
                    "sessions": 100,
                    "date": "2015-08-07"
                },
                {
                    "sessions": 30,
                    "date": "2015-08-08"
                },
                {
                    "sessions": 94,
                    "date": "2015-08-09"
                },
                {
                    "sessions": 11,
                    "date": "2015-08-10"
                }
            ];

            var data = getArrayOfArraysForLineChart(scope.users, "date", "pageviews", true);
            var data2 = getArrayOfArraysForLineChart(scope.sessions, "date", "sessions", true);

            var dataset = [];
            var chartData1 = getLineChartData(data2, "Sessions", LINE_CHART_MAIN_COLOR);
            var chartData2 = getLineChartData(data, "Pageviews", LINE_CHART_SUB_COLOR);
            dataset.push(chartData1[0]);
            dataset.push(chartData1[1]);
            //dataset.push(chartData2[0]);
            //dataset.push(chartData2[1]);

            drawLineChart("#dashboard-summary-chart", dataset);
        }
    }
}]);