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

/**
 * DIRECTIVES
 */

directivesModule.directive('reportingDashboardOverview', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-dashboard-overview.html',
        link: function(scope, element, attrs){
            scope.dashboardSummaryData = null;
            scope.currentChart = null;
            scope.chartDataset = [];

            function renderDashboardOverview(){
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;
                var queryString = '/app/overview?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;
                console.log(queryString);

                $http.get(queryString).success(function(data) {
                    scope.dashboardSummaryData = data;
                    // Calculate the total / average values
                    scope.sumOfSessions = 0;
                    scope.sumOfUsers = 0;
                    scope.sumOfPageviews = 0;
                    scope.sumOfEntrances = 0;
                    scope.sumOfBounces = 0;
                    scope.sumOfSessionsDuration = 0;

                    for (var i = 0; i< data.length; i++){
                        scope.sumOfSessions += data[i].sessions;
                        scope.sumOfUsers += data[i].users;
                        scope.sumOfPageviews += data[i].pageviews;
                        scope.sumOfEntrances += data[i].entrances;
                        scope.sumOfBounces += data[i].bounces;
                        scope.sumOfSessionsDuration += data[i].sessionDuration;
                    }
                    scope.sumOfPageSessions = (parseFloat(scope.sumOfPageviews) / scope.sumOfSessions).toFixed(2);
                    scope.sumOfBounceRate = (parseFloat(scope.sumOfBounces) * 100 / scope.sumOfEntrances).toFixed(2);
                    scope.sumOfPercentNewVists = (parseFloat(scope.sumOfUsers) * 100 / scope.sumOfSessions).toFixed(2);
                    scope.avgSessionDuration = (scope.sumOfSessionsDuration / scope.sumOfSessions);
                    var date = new Date(null);
                    date.setSeconds(scope.avgSessionDuration); // specify value for SECONDS here
                    scope.avgSessionDuration = date.toISOString().substr(11, 8);

                    // By default, the 'Sessions' chart is the current chart
                    scope.currentChart = "sessions";
                    var sessionsData = getArrayOfArraysForLineChart(scope.dashboardSummaryData, "date", "sessions", true);
                    var chartData = getLineChartData(sessionsData, "Sessions", LINE_CHART_MAIN_COLOR);
                    scope.chartDataset = [];
                    scope.chartDataset.push(chartData[0]);
                    scope.chartDataset.push(chartData[1]);
                    drawLineChart("#dashboard-summary-chart", scope.chartDataset);
                });
            }

            $(".total-metrics .panel-body").unbind();
            $(".total-metrics .panel-body").click(function(event){
                $(this).parent().parent().parent().find(".panel-body").each(function(){
                    $(this).removeClass("active");
                });
                $(this).addClass("active");
                var chartLabel = $(this).data("chart-label");
                var fieldname = $(this).data("field-name");
                scope.currentChart = fieldname;
                var currentChartData = getArrayOfArraysForLineChart(scope.dashboardSummaryData, "date", fieldname, true);
                var chartData = getLineChartData(currentChartData, chartLabel, LINE_CHART_MAIN_COLOR);
                scope.chartDataset = [];
                scope.chartDataset.push(chartData[0]);
                scope.chartDataset.push(chartData[1]);
                drawLineChart("#dashboard-summary-chart", scope.chartDataset);
            });

            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function(){
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo){
                    renderDashboardOverview();
                }
            });
            scope.$on("datepickerChanged", renderDashboardOverview);
            scope.$on("appSelectChanged", renderDashboardOverview);


            //var data = getArrayOfArraysForLineChart(scope.users, "date", "pageviews", true);
            //var data2 = getArrayOfArraysForLineChart(scope.sessions, "date", "sessions", true);

            //var dataset = [];
            //var chartData1 = getLineChartData(data2, "Sessions", LINE_CHART_MAIN_COLOR);
            //var chartData2 = getLineChartData(data, "Pageviews", LINE_CHART_SUB_COLOR);
            //dataset.push(chartData1[0]);
            //dataset.push(chartData1[1]);
            //dataset.push(chartData2[0]);
            //dataset.push(chartData2[1]);

            //drawLineChart("#dashboard-summary-chart", dataset);
        }
    }
}]);