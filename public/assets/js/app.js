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
            templateUrl: '/views/reporting/reporting-dashboard.html'
        })
        .when('/pages-overview', {
            templateUrl: '/views/reporting/reporting-pages-overview.html'
        })
        .when('/geo-language', {
            templateUrl: '/views/reporting/reporting-geo-language.html'
        })


        .when('/404', {
            templateUrl: '/views/404.html'
        })
        .when('/500', {
            templateUrl: '/views/500.html'
        })
        .otherwise({
            redirectTo: '/404'
        });
}]);