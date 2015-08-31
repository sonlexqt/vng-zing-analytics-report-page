var controllersModule = angular.module('zaApp.Controllers', []);

controllersModule.controller('DatepickerController', ['$scope', '$rootScope', function($scope, $rootScope){
    var todayDateObject = new Date();
    todayDateObject.setHours(0);
    todayDateObject.setMinutes(0);
    todayDateObject.setSeconds(0);
    var yesterday = todayDateObject.setDate(todayDateObject.getDate() - 1);
    var yesterdayDateObject = new Date(yesterday);
    var twoWeekAgoDateObject = new Date(todayDateObject.setDate(todayDateObject.getDate() - 13));

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
        separator: ' <i class="fa fa-chevron-circle-right"></i> ',
        endDate: yesterdayDateString,
        showShortcuts: false
    });
}]);