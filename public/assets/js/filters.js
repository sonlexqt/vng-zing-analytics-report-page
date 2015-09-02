var filtersModule = angular.module('zaApp.Filters', []);

filtersModule.filter('readableDate', function() {
    return function(input) {
        var dateObjectFromInput = new Date(input);
        return moment(dateObjectFromInput).format('YYYY-MM-DD, h:mm:ss a');
    };
});

filtersModule.filter('timeInHHMMSS', function() {
    return function(input) {
        var date = new Date(null);
        date.setSeconds(parseInt(input)); // specify value for SECONDS here
        return date.toISOString().substr(11, 8);
    };
});

filtersModule.filter('percentage', ['$filter', function ($filter) {
    return function (input, sum, decimals) {
        return $filter('number')(parseFloat(input * 100) / sum, decimals) + '%';
    };
}]);

filtersModule.filter('decimals', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(parseFloat(input), decimals);
    };
}]);

filtersModule.filter('currentDate',['$filter',  function($filter) {
    return function() {
        return $filter('date')(new Date(), 'yyyy-MM-dd');
    };
}]);