var zaApp = angular.module('zaApp', [
    'ngRoute',
    'zaApp.Controllers',
    'zaApp.Services',
    'zaApp.Filters',
    'zaApp.Directives'
]);

zaApp.config(function($interpolateProvider, $httpProvider){
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    }
);

zaApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

    $routeProvider
        .when('/', {
            templateUrl: '/views/reporting/reporting-overview.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);