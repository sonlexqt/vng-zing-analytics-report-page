var directivesModule = angular.module('zaApp.Directives', []);

/**
 * Helper Functions
 */
var LINE_CHART_MAIN_COLOR = "rgba(34, 186, 160, 1)";
var LINE_CHART_SUB_COLOR = "rgba(63, 127, 191, 1)";

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

function getArrayOfArraysForDrawingChart(arrayOfObjects, property1, property2, isProperty1DateTime){
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

function removeElementFromArray(array, search_field, search_term){
    var res = array;
    for (var i = res.length-1; i>=0; i--) {
        if (res[i][search_field] === search_term) {
            res.splice(i, 1);
            break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
    return res;
}

function getTicksAndDataArrayForLanguageChart(array){
    var ticksArray = [];
    var dataArray = [];
    for (var i = 0; i < array.length; i++){
        var ticksArrayRow = [
            i,
            array[i][0]
        ];
        ticksArray.push(ticksArrayRow);
        var dataArrayRow = [
            i,
            array[i][1]
        ];
        dataArray.push(dataArrayRow);
    }
    return {
        ticksArray: ticksArray,
        dataArray: dataArray
    }
}

function drawBarChart(elementSelector, dataArray, ticksArray, columnLabel){
    if($(elementSelector).length)
    {
        var plot = $.plot($(elementSelector),
            [
                {
                    data: dataArray,
                    label: columnLabel
                }
            ], {
                series: {
                    bars: {
                        show: true,
                        fill: true,
                        align: "center"
                    },
                    legend: {
                        show: false
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "rgba(255,255,255,0.05)",
                    borderWidth: 0
                },
                colors: [
                    "rgba(34, 186, 160, 0.8)"
                ],
                xaxis: {
                    ticks: ticksArray,
                    color: "rgba(255,255,255,0.8)"
                },
                yaxis: {
                    color: "rgba(255,255,255,0.8)"
                }
            });

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css( {
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

        function getXAxisLabel(x){
            for (var i = 0; i < ticksArray.length; i++){
                if (ticksArray[i][0] == x){
                    return ticksArray[i][1];
                }
            }
        }

        var previousPoint = null;
        $(elementSelector).bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    showTooltip(item.pageX, item.pageY,
                        item.series.label + " of " + getXAxisLabel(x) + " = " + Math.round(y));
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

// THE DASHBOARD PAGE

directivesModule.directive('reportingDashboardOverview', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-dashboard-overview.html',
        link: function(scope, element, attrs){
            scope.dashboardOverviewData = null;
            scope.currentChart = null;
            scope.chartDataset = [];
            scope.secondChartsArray = [];
            scope.secondChart = {
                fieldName: "none",
                chartLabel: "None"
            };

            function renderDashboardOverview(){
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;
                var queryString = '/app/overview?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;
                console.log(queryString);

                $http.get(queryString).success(function(data) {
                    scope.dashboardOverviewData = data;
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
                    scope.currentChart = {
                        fieldName: "sessions",
                        chartLabel: "Sessions"
                    };
                    scope.secondChart = {
                        fieldName: "none",
                        chartLabel: "None"
                    };
                    // Render the chart
                    var sessionsData = getArrayOfArraysForDrawingChart(scope.dashboardOverviewData, "date", "sessions", true);
                    var chartData = getLineChartData(sessionsData, "Sessions", LINE_CHART_MAIN_COLOR);
                    scope.chartDataset = [];
                    scope.chartDataset.push(chartData[0]);
                    scope.chartDataset.push(chartData[1]);
                    drawLineChart("#dashboard-overview-chart", scope.chartDataset);
                    // Modify the second charts array (for comparison)
                    var chartsList = [
                        {
                            fieldName: "sessions",
                            chartLabel: "Sessions"
                        },
                        {
                            fieldName: "users",
                            chartLabel: "Users"
                        },
                        {
                            fieldName: "pageviews",
                            chartLabel: "Pageviews"
                        },
                        {
                            fieldName: "avgSessionDuration",
                            chartLabel: "Avg. Sessions Duration"
                        },
                        {
                            fieldName: "bounceRate",
                            chartLabel: "Bounce Rate"
                        },
                        {
                            fieldName: "percentNewVists",
                            chartLabel: "% New Visits"
                        }
                    ];
                    scope.secondChartsArray = removeElementFromArray(chartsList, "fieldName", "sessions");
                    // Reset 'active' class to the Sessions chart
                    angular.element(".total-metrics .panel-body").each(function(){
                        angular.element(this).removeClass("active");
                    });
                    angular.element(".total-metrics .panel-body").first().addClass("active");
                });
            }

            scope.handleMetricBadgesClick = function($event){
                var thisBadge = angular.element($event.currentTarget);
                thisBadge.parent().parent().parent().find(".panel-body").each(function(){
                    angular.element(this).removeClass("active");
                });
                thisBadge.addClass("active");
                var chartLabel = thisBadge.data("chart-label");
                var fieldName = thisBadge.data("field-name");
                scope.currentChart = {
                    fieldName: fieldName,
                    chartLabel: chartLabel
                };
                scope.secondChart = {
                    fieldName: "none",
                    chartLabel: "None"
                };
                var currentChartData = getArrayOfArraysForDrawingChart(scope.dashboardOverviewData, "date", fieldName, true);
                var chartData = getLineChartData(currentChartData, chartLabel, LINE_CHART_MAIN_COLOR);
                scope.chartDataset = [];
                scope.chartDataset.push(chartData[0]);
                scope.chartDataset.push(chartData[1]);
                drawLineChart("#dashboard-overview-chart", scope.chartDataset);

                var chartsList = [
                    {
                        fieldName: "sessions",
                        chartLabel: "Sessions"
                    },
                    {
                        fieldName: "users",
                        chartLabel: "Users"
                    },
                    {
                        fieldName: "pageviews",
                        chartLabel: "Pageviews"
                    },
                    {
                        fieldName: "avgSessionDuration",
                        chartLabel: "Avg. Sessions Duration"
                    },
                    {
                        fieldName: "bounceRate",
                        chartLabel: "Bounce Rate"
                    },
                    {
                        fieldName: "percentNewVists",
                        chartLabel: "% New Visits"
                    }
                ];
                scope.secondChartsArray = removeElementFromArray(chartsList, "fieldName", scope.currentChart.fieldName);
            };

            scope.getSecondChartValue = function($event){
                var selectedVal = "";
                var selected = $("input[type='radio'][name='select-second-chart-radio']:checked");
                if (selected.length > 0) {
                    var selectedFieldName = selected.val();
                    var selectedChartLabel = selected.parent().find("span").text();
                    scope.secondChart = {
                        fieldName: selectedFieldName,
                        chartLabel: selectedChartLabel
                    };
                    $('#select-second-chart-modal').modal('toggle');
                    var currentChartArrayData = getArrayOfArraysForDrawingChart(scope.dashboardOverviewData, "date", scope.currentChart.fieldName, true);
                    var currentChartData = getLineChartData(currentChartArrayData, scope.currentChart.chartLabel, LINE_CHART_MAIN_COLOR);
                    var secondChartArrayData = getArrayOfArraysForDrawingChart(scope.dashboardOverviewData, "date", scope.secondChart.fieldName, true);
                    var secondChartData = getLineChartData(secondChartArrayData, scope.secondChart.chartLabel, LINE_CHART_SUB_COLOR);
                    scope.chartDataset = [];
                    scope.chartDataset.push(currentChartData[0]);
                    scope.chartDataset.push(currentChartData[1]);
                    scope.chartDataset.push(secondChartData[0]);
                    scope.chartDataset.push(secondChartData[1]);
                    drawLineChart("#dashboard-overview-chart", scope.chartDataset);
                }
            };

            scope.clearSecondChartValue = function($event){
                scope.secondChart = {
                    fieldName: "none",
                    chartLabel: "None"
                };
                // Render the chart
                var currentChartArrayData = getArrayOfArraysForDrawingChart(scope.dashboardOverviewData, "date", scope.currentChart.fieldName, true);
                var chartData = getLineChartData(currentChartArrayData, scope.currentChart.chartLabel, LINE_CHART_MAIN_COLOR);
                scope.chartDataset = [];
                scope.chartDataset.push(chartData[0]);
                scope.chartDataset.push(chartData[1]);
                drawLineChart("#dashboard-overview-chart", scope.chartDataset);
            };

            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function(){
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo){
                    renderDashboardOverview();
                }
            });
            scope.$on("datepickerChanged", renderDashboardOverview);
            scope.$on("appSelectChanged", renderDashboardOverview);
        }
    }
}]);

directivesModule.directive('reportingDashboardDemographics', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-dashboard-demographics.html',
        link: function (scope, element, attrs) {
            scope.cityChartData = null;

            function renderDashboardDemographics(){
                // The Demographics > Language chart
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;
                var languageQueryString = '/app/language?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;
                console.log(languageQueryString);

                $http.get(languageQueryString).success(function(data) {
                    var dataForBarChart = getArrayOfArraysForDrawingChart(data, "language", "sessions", false);
                    var modifiedData = getTicksAndDataArrayForLanguageChart(dataForBarChart);
                    drawBarChart("#dashboard-demographics-language-chart", modifiedData.dataArray, modifiedData.ticksArray, "Sessions");
                });

                // The Demographics > City chart
                var chart = new google.visualization.GeoChart(document.getElementById("dashboard-demographics-city-chart"));
                var chartHolder = angular.element("#dashboard-demographics-city-chart");
                var parentWidth = angular.element("#dashboard-demographics-city-chart").parent().width();
                chartHolder.width(parentWidth);
                var options = {};
                $http.get('/data/dashboard-demographics-city-data.json').success(function(data) {
                    data.unshift(['City', 'Sessions', '% Sessions']);
                    scope.cityChartData = data;
                    options = {
                        region: 'VN',
                        displayMode: 'markers',
                        resolution: 'provinces',
                        width: Number(parentWidth),
                        height: '100%',
                        colorAxis: {colors: ['#fff', '#22BAA0']}
                    };
                });
                scope.$watch('cityChartData', function(v) {
                    if (!!v){
                        var data = google.visualization.arrayToDataTable(v);
                        chart.draw(data, options);
                    }
                });

                $(window).bind('resizeEnd', function(){
                    var chartHolder = angular.element("#dashboard-demographics-city-chart");
                    var parentWidth = chartHolder.parent().width();
                    chartHolder.width(parentWidth);
                    options = {
                        region: 'VN',
                        displayMode: 'markers',
                        resolution: 'provinces',
                        width: Number(parentWidth),
                        height: '100%',
                        colorAxis: {colors: ['#e7711c', '#4374e0']}
                    };
                    var data = google.visualization.arrayToDataTable(scope.cityChartData);
                    chart.draw(data, options);
                });
                $(window).resize(function() {
                    if(this.resizeTO) clearTimeout(this.resizeTO);
                    this.resizeTO = setTimeout(function() {
                        $(this).trigger('resizeEnd');
                    }, 250);
                });
            }

            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function(){
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo){
                    renderDashboardDemographics();
                }
            });
            scope.$on("datepickerChanged", renderDashboardDemographics);
            scope.$on("appSelectChanged", renderDashboardDemographics);
        }
    }
}]);

directivesModule.directive('reportingDashboardSystem', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-dashboard-system.html',
        link: function (scope, element, attrs) {
            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function(){
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo){
                    renderDashboardSystem();
                }
            });

            scope.$on("datepickerChanged", renderDashboardSystem);
            scope.$on("appSelectChanged", renderDashboardSystem);

            function renderDashboardSystem(){
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;

                // The Browsers part
                scope.allBrowsersSessions = 0;
                scope.chromeSessions = 0;
                scope.firefoxSessions = 0;
                scope.operaSessions = 0;
                scope.safariSessions = 0;
                scope.ieSessions = 0;
                scope.otherBrowsersSessions = 0;

                var browserQueryString = '/app/browser?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;
                $http.get(browserQueryString).success(function(data) {
                    for (var i = 0; i < data.length; i++){
                        switch (data[i].browserName){
                            case "Chrome":
                                scope.chromeSessions = data[i].sessions;
                                scope.allBrowsersSessions+= data[i].sessions;
                                break;
                            case "Firefox":
                                scope.firefoxSessions = data[i].sessions;
                                scope.allBrowsersSessions+= data[i].sessions;
                                break;
                            case "Safari":
                                scope.safariSessions = data[i].sessions;
                                scope.allBrowsersSessions+= data[i].sessions;
                                break;
                            case "Opera":
                                scope.operaSessions = data[i].sessions;
                                scope.allBrowsersSessions+= data[i].sessions;
                                break;
                            case "Internet Explorer":
                                scope.ieSessions = data[i].sessions;
                                scope.allBrowsersSessions+= data[i].sessions;
                                break;
                            default:
                                scope.otherBrowsersSessions = data[i].sessions;
                                scope.allBrowsersSessions+= data[i].sessions;
                        }
                    }
                });

                // The Operating Systems part
                scope.allOSSessions = 0;
                scope.windowsSessions = 0;
                scope.macOSSessions = 0;
                scope.linuxSessions = 0;
                scope.androidSessions = 0;
                scope.iOSSessions = 0;
                scope.otherOSSessions = 0;

                var osQueryString = '/app/os?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;
                $http.get(osQueryString).success(function(data) {
                    for (var i = 0; i < data.length; i++){
                        switch (data[i].osName){
                            case "Windows":
                                scope.windowsSessions = data[i].sessions;
                                scope.allOSSessions+= data[i].sessions;
                                break;
                            case "Mac OS":
                                scope.macOSSessions = data[i].sessions;
                                scope.allOSSessions+= data[i].sessions;
                                break;
                            case "Linux":
                                scope.linuxSessions = data[i].sessions;
                                scope.allOSSessions+= data[i].sessions;
                                break;
                            case "Android":
                                scope.androidSessions = data[i].sessions;
                                scope.allOSSessions+= data[i].sessions;
                                break;
                            case "iOS":
                                scope.iOSSessions = data[i].sessions;
                                scope.allOSSessions+= data[i].sessions;
                                break;
                            default:
                                scope.otherOSSessions = data[i].sessions;
                                scope.allOSSessions+= data[i].sessions;
                        }
                    }
                });
            }
        }
    }
}]);

// THE PAGES OVERVIEW PAGE

directivesModule.directive('reportingPagesOverviewContent', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-pages-overview-content.html',
        link: function (scope, element, attrs) {
            scope.zaPagesOverviewData = null;
            scope.zaPagesOverviewTableData = null;

            scope.tableTotalPageviews = null;
            scope.tableTotalUniquePageviews = null;
            scope.tableTotalEntrances = null;

            function renderPagesOverview(){
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;
                var queryByDateString = '/app/page?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo + '&by=date';
                $http.get(queryByDateString).success(function(data) {
                    scope.zaPagesOverviewData = data;

                    // Calculate the total / average values
                    scope.sumOfPageviews = 0;
                    scope.sumOfUniquePageviews = 0;
                    scope.sumOfTimeOnPage = 0;
                    scope.sumOfBounces = 0;
                    scope.sumOfEntrances = 0;
                    scope.sumOfExits = 0;

                    for (var i = 0; i< data.length; i++){
                        scope.sumOfPageviews += data[i].pageviews;
                        scope.sumOfUniquePageviews += data[i].uniquePageviews;
                        scope.sumOfTimeOnPage += data[i].timeOnPage;
                        scope.sumOfBounces += data[i].bounces;
                        scope.sumOfEntrances += data[i].entrances;
                        scope.sumOfExits += data[i].exits;
                    }
                    scope.avgTimeOnPage = (scope.sumOfTimeOnPage) / (scope.sumOfPageviews - scope.sumOfExits);
                    var date = new Date(null);
                    date.setSeconds(scope.avgTimeOnPage); // specify value for SECONDS here
                    scope.avgTimeOnPage = date.toISOString().substr(11, 8);
                    scope.sumOfBounceRate = (parseFloat(scope.sumOfBounces) * 100 / scope.sumOfEntrances).toFixed(2);
                    scope.sumOfPercentExit = (parseFloat(scope.sumOfExits) * 100 / scope.sumOfPageviews).toFixed(2);

                    // By default, the 'Pageviews' chart is the current chart
                    scope.currentChart = {
                        fieldName: "pageviews",
                        chartLabel: "Pageviews"
                    };
                    scope.secondChart = {
                        fieldName: "none",
                        chartLabel: "None"
                    };
                    // Render the chart
                    var pageviewsData = getArrayOfArraysForDrawingChart(scope.zaPagesOverviewData, "date", "pageviews", true);
                    var chartData = getLineChartData(pageviewsData, "Pageviews", LINE_CHART_MAIN_COLOR);
                    scope.chartDataset = [];
                    scope.chartDataset.push(chartData[0]);
                    scope.chartDataset.push(chartData[1]);
                    drawLineChart("#pages-overview-chart", scope.chartDataset);
                    // Modify the second charts array (for comparison)
                    var chartsList = [
                        {
                            fieldName: "pageviews",
                            chartLabel: "Pageviews"
                        },
                        {
                            fieldName: "uniquePageviews",
                            chartLabel: "Unique Pageviews"
                        },
                        {
                            fieldName: "avgTimeOnPage",
                            chartLabel: "Avg. Time On Page"
                        },
                        {
                            fieldName: "bounceRate",
                            chartLabel: "Bounce Rate"
                        },
                        {
                            fieldName: "percentExit",
                            chartLabel: "% Exits"
                        }
                    ];
                    scope.secondChartsArray = removeElementFromArray(chartsList, "fieldName", "pageviews");
                    // Reset 'active' class to the Sessions chart
                    angular.element(".total-metrics .panel-body").each(function(){
                        angular.element(this).removeClass("active");
                    });
                    angular.element(".total-metrics .panel-body").first().addClass("active");
                });

                var queryByPathString = '/app/page?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo + '&by=path';
                console.log(queryByPathString);
                $http.get(queryByPathString).success(function(data) {
                    scope.zaPagesOverviewTableData = data;
                    // Calculate the total / average values
                    scope.tableTotalPageviews = 0;
                    scope.tableTotalUniquePageviews = 0;
                    scope.tableTotalEntrances = 0;
                    for (var i = 0; i < data.length; i++){
                        scope.tableTotalPageviews += data[i].pageviews;
                        scope.tableTotalUniquePageviews += data[i].uniquePageviews;
                        scope.tableTotalEntrances += data[i].entrances;
                    }
                });
            }

            scope.handleMetricBadgesClick = function($event){
                var thisBadge = angular.element($event.currentTarget);
                thisBadge.parent().parent().parent().find(".panel-body").each(function(){
                    angular.element(this).removeClass("active");
                });
                thisBadge.addClass("active");
                var chartLabel = thisBadge.data("chart-label");
                var fieldName = thisBadge.data("field-name");
                scope.currentChart = {
                    fieldName: fieldName,
                    chartLabel: chartLabel
                };
                scope.secondChart = {
                    fieldName: "none",
                    chartLabel: "None"
                };
                var currentChartData = getArrayOfArraysForDrawingChart(scope.zaPagesOverviewData, "date", fieldName, true);
                var chartData = getLineChartData(currentChartData, chartLabel, LINE_CHART_MAIN_COLOR);
                scope.chartDataset = [];
                scope.chartDataset.push(chartData[0]);
                scope.chartDataset.push(chartData[1]);
                drawLineChart("#pages-overview-chart", scope.chartDataset);

                var chartsList = [
                    {
                        fieldName: "pageviews",
                        chartLabel: "Pageviews"
                    },
                    {
                        fieldName: "uniquePageviews",
                        chartLabel: "Unique Pageviews"
                    },
                    {
                        fieldName: "avgTimeOnPage",
                        chartLabel: "Avg. Time On Page"
                    },
                    {
                        fieldName: "bounceRate",
                        chartLabel: "Bounce Rate"
                    },
                    {
                        fieldName: "percentExit",
                        chartLabel: "% Exits"
                    }
                ];
                scope.secondChartsArray = removeElementFromArray(chartsList, "fieldName", scope.currentChart.fieldName);
            };

            scope.getSecondChartValue = function($event){
                var selectedVal = "";
                var selected = $("input[type='radio'][name='select-second-chart-radio']:checked");
                if (selected.length > 0) {
                    var selectedFieldName = selected.val();
                    var selectedChartLabel = selected.parent().find("span").text();
                    scope.secondChart = {
                        fieldName: selectedFieldName,
                        chartLabel: selectedChartLabel
                    };
                    $('#select-second-chart-modal').modal('toggle');
                    var currentChartArrayData = getArrayOfArraysForDrawingChart(scope.zaPagesOverviewData, "date", scope.currentChart.fieldName, true);
                    var currentChartData = getLineChartData(currentChartArrayData, scope.currentChart.chartLabel, LINE_CHART_MAIN_COLOR);
                    var secondChartArrayData = getArrayOfArraysForDrawingChart(scope.zaPagesOverviewData, "date", scope.secondChart.fieldName, true);
                    var secondChartData = getLineChartData(secondChartArrayData, scope.secondChart.chartLabel, LINE_CHART_SUB_COLOR);
                    scope.chartDataset = [];
                    scope.chartDataset.push(currentChartData[0]);
                    scope.chartDataset.push(currentChartData[1]);
                    scope.chartDataset.push(secondChartData[0]);
                    scope.chartDataset.push(secondChartData[1]);
                    drawLineChart("#pages-overview-chart", scope.chartDataset);
                }
            };

            scope.clearSecondChartValue = function($event){
                scope.secondChart = {
                    fieldName: "none",
                    chartLabel: "None"
                };
                // Render the chart
                var currentChartArrayData = getArrayOfArraysForDrawingChart(scope.zaPagesOverviewData, "date", scope.currentChart.fieldName, true);
                var chartData = getLineChartData(currentChartArrayData, scope.currentChart.chartLabel, LINE_CHART_MAIN_COLOR);
                scope.chartDataset = [];
                scope.chartDataset.push(chartData[0]);
                scope.chartDataset.push(chartData[1]);
                drawLineChart("#pages-overview-chart", scope.chartDataset);
            };

            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function () {
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo) {
                    renderPagesOverview();
                }
            });

            scope.$on("datepickerChanged", renderPagesOverview);
            scope.$on("appSelectChanged", renderPagesOverview);
        }
    }
}]);

directivesModule.directive('zaDataTable', ['$timeout', function($timeout) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            $timeout(function () {
                element.DataTable();
            }, 1000);
        }
    }
}]);

directivesModule.directive('tableTooltip', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {}, // isolated scope
        templateUrl: '/views/reporting/table-tooltip.html',
        link: function (scope, element, attrs) {
            scope.tooltipTitle = attrs["tooltipTitle"];
            element.hover(function(){
                // on mouseenter
                element.tooltip('show');
            }, function(){
                // on mouseleave
                element.tooltip('hide');
            });
        }
    }
});

// THE GEO > LANGUAGE PAGE

directivesModule.directive('reportingGeoLanguageContent', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-geo-language-content.html',
        link: function (scope, element, attrs) {
            scope.geoLanguageTableData = null;
            scope.tableTotalSessions = 0;
            scope.tableTotalNewUsers = 0;

            function renderGeoLanguage(){
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;
                var queryString = '/app/language?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;

                $http.get(queryString).success(function(data) {
                    scope.geoLanguageTableData = data;
                    // Calculate the total / average values
                    scope.tableTotalSessions = 0;
                    scope.tableTotalNewUsers = 0;
                    for (var i = 0; i < data.length; i++){
                        scope.tableTotalSessions += data[i].sessions;
                        scope.tableTotalNewUsers += data[i].newUsers;
                    }
                });
            }

            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function(){
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo){
                    renderGeoLanguage();
                }
            });

            scope.$on("datepickerChanged", renderGeoLanguage);
            scope.$on("appSelectChanged", renderGeoLanguage);
        }
    }
}]);

// THE GEO > LOCATION PAGE

directivesModule.directive('reportingGeoLocationContent', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/views/reporting/reporting-geo-location-content.html',
        link: function (scope, element, attrs) {
            scope.geoLocationTableData = null;
            scope.cityChartData = null;
            scope.tableTotalSessions = 0;
            scope.tableTotalNewUsers = 0;

            function renderGeoLocation(){
                var dateFrom = $rootScope.dateFrom.getTime();
                var dateTo = $rootScope.dateTo.getTime();
                var currentAppId = $rootScope.currentAppId;
                var queryString = '/app/location?app_id='+ currentAppId +'&from=' + dateFrom + '&to=' + dateTo;

                $http.get(queryString).success(function(data) {
                    scope.geoLocationTableData = data;
                    // Calculate the total / average values
                    scope.tableTotalSessions = 0;
                    scope.tableTotalNewUsers = 0;
                    for (var i = 0; i < data.length; i++){
                        scope.tableTotalSessions += data[i].sessions;
                        scope.tableTotalNewUsers += data[i].newUsers;
                    }
                });

                // The Geochart
                var chart = new google.visualization.GeoChart(document.getElementById("geo-location-city-chart"));
                var chartHolder = angular.element("#geo-location-city-chart");
                var parentWidth = angular.element("#geo-location-city-chart").parent().width();
                chartHolder.width(parentWidth);
                var options = {};
                $http.get('/data/dashboard-demographics-city-data.json').success(function(data) {
                    data.unshift(['City', 'Sessions', '% Sessions']);
                    scope.cityChartData = data;
                    options = {
                        region: 'VN',
                        displayMode: 'markers',
                        resolution: 'provinces',
                        width: Number(parentWidth),
                        height: '100%',
                        colorAxis: {colors: ['#fff', '#22BAA0']}
                    };
                });
                scope.$watch('cityChartData', function(v) {
                    if (!!v){
                        var data = google.visualization.arrayToDataTable(v);
                        chart.draw(data, options);
                    }
                });

                $(window).bind('resizeEnd', function(){
                    var chartHolder = angular.element("#geo-location-city-chart");
                    var parentWidth = chartHolder.parent().width();
                    chartHolder.width(parentWidth);
                    options = {
                        region: 'VN',
                        displayMode: 'markers',
                        resolution: 'provinces',
                        width: Number(parentWidth),
                        height: '100%',
                        colorAxis: {colors: ['#e7711c', '#4374e0']}
                    };
                    var data = google.visualization.arrayToDataTable(scope.cityChartData);
                    chart.draw(data, options);
                });
                $(window).resize(function() {
                    if(this.resizeTO) clearTimeout(this.resizeTO);
                    this.resizeTO = setTimeout(function() {
                        $(this).trigger('resizeEnd');
                    }, 250);
                });
            }

            $rootScope.$watchGroup(['currentAppId', 'dateFrom', 'dateTo'], function(){
                if ($rootScope.currentAppId && $rootScope.dateFrom && $rootScope.dateTo){
                    renderGeoLocation();
                }
            });

            scope.$on("datepickerChanged", renderGeoLocation);
            scope.$on("appSelectChanged", renderGeoLocation);
        }
    }
}]);
