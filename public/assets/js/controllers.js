var controllersModule = angular.module('zaApp.Controllers', []);

controllersModule.controller('ZAAppController', ['$scope', '$rootScope', '$http', '$location', '$timeout', function($scope, $rootScope, $http, $location, $timeout){
    //TODO use these loading handlers
    $rootScope.$on('startLoadingData', function(){
        $("#loading-dialog").modal();
    });
    $rootScope.$on('finishLoadingData', function(){
        $("#loading-dialog").modal('hide');
    });

    $scope.$on('$viewContentLoaded', function(event) {
        $(".table-tooltip").tooltip();

        $http.get('/profile').success(function(data) {
            $rootScope.userProfile = data;
        });

        $http.get('/apps').success(function(data) {
            $rootScope.userApps = data;
        });

        $timeout(function(){
            $rootScope.currentAppId = $("#app-id-selector").val();
        }, 500);
    });

    // the default initial page
    $rootScope.currentTab = 'reporting';

    var currentPath = $location.path();
    if (currentPath.indexOf('management') > -1){
        $rootScope.currentTab = 'management';
    }

    //TODO handle later
    $scope.selectSidebarMenu = function(){
        return '/views/templates/' + $rootScope.currentTab + '/sidebar.html';
    };

}]);

controllersModule.controller('DatepickerController', ['$scope', '$rootScope', function($scope, $rootScope){
    var todayDateObject = new Date();
    todayDateObject.setHours(0);
    todayDateObject.setMinutes(0);
    todayDateObject.setSeconds(0);
    var yesterday = todayDateObject.setDate(todayDateObject.getDate() - 1);
    var yesterdayDateObject = new Date(yesterday);
    var threeWeekAgoDateObject = new Date(todayDateObject.setDate(todayDateObject.getDate() - 20));

    var yesterdayDateString = moment(yesterdayDateObject).format("YYYY-MM-DD");

    $("#za-date-range-picker-span").dateRangePicker({
        format: 'YYYY-MM-DD',
        getValue: function()
        {
            return this.innerHTML;
        },
        setValue: function(s)
        {
            this.innerHTML = s;
        },
        separator: ' <i class="fa fa-chevron-circle-right" style="color: #22BAA0;"></i> ',
        endDate: yesterdayDateString,
        showShortcuts: false
    });

    $("#za-date-range-picker-span").bind('datepicker-change', function (event, obj) {
        if (obj.date1 && obj.date2){
            $rootScope.dateFrom = obj.date1;
            $rootScope.dateTo = obj.date2;
            $rootScope.$broadcast('datepickerChanged');
        }
        else {
            console.log("ERROR: obj.date1 or obj.date2 is undefined");
        }
    });

    // set default date range
    if (!$rootScope.dateFrom || !$rootScope.dateTo){
        $("#za-date-range-picker-span")
            .data('dateRangePicker')
            .setDateRange(moment(threeWeekAgoDateObject).format("YYYY-MM-DD"),
            moment(yesterdayDateObject).format("YYYY-MM-DD"));
        $rootScope.dateFrom = threeWeekAgoDateObject;
        $rootScope.dateTo = yesterdayDateObject;
    }

    $(".date-picker-wrapper .drp_top-bar .apply-btn").click(function(){
        $rootScope.$broadcast('datepickerChanged');
    });

    $("#app-id-selector").change(function(){
        $rootScope.currentAppId = $(this).val();
        $rootScope.$broadcast('appSelectChanged');
    });
}]);