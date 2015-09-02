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

    // Handle zaTab navigation
    $('.za-tab .hvr-underline-reveal').unbind();
    $('.za-tab .hvr-underline-reveal').click(function(){
        $rootScope.currentTab = $(this).data("zatab");
        $('.za-tab .hvr-underline-reveal').removeClass('active');
        $(this).addClass('active');
        $scope.$digest();
    });

    $scope.selectSidebarMenu = function(){
        return '/views/' + $rootScope.currentTab + '/sidebar.html';
    };

    // sortable
    $(".sortable").sortable({
        connectWith: '.sortable',
        items: '.panel',
        helper: 'original',
        revert: true,
        placeholder: 'panel-placeholder',
        forcePlaceholderSize: true,
        opacity: 0.95,
        cursor: 'move'
    });

    // Panel Control
    $('.panel-collapse').click(function(){
        $(this).closest(".panel").children('.panel-body').slideToggle('fast');
    });

    $('.panel-remove').click(function(){
        $(this).closest(".panel").hide();
    });

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

    $(".date-picker-wrapper .drp_top-bar .apply-btn").unbind();
    $(".date-picker-wrapper .drp_top-bar .apply-btn").click(function(){
        $rootScope.$broadcast('datepickerChanged');
    });

    $("#app-id-selector").change(function(){
        $rootScope.currentAppId = $(this).val();
        $rootScope.$broadcast('appSelectChanged');
    });
}]);

controllersModule.controller('PageContentController', ['$scope', function($scope){
    $scope.$on('$viewContentLoaded', function(event) {

        // Sidebar Menu
        $('.sidebar .accordion-menu li .sub-menu').slideUp(0);
        $('.sidebar .accordion-menu li.open .sub-menu').slideDown(0);
        $('.small-sidebar .sidebar .accordion-menu li.open .sub-menu').hide(0);
        $('.sidebar .accordion-menu > li.droplink > a').unbind();
        $('.sidebar .accordion-menu > li.droplink > a').click(function(){
            var menu = $('.sidebar .menu'),
                sidebar = $('.page-sidebar-inner'),
                page = $('.page-content'),
                sub = $(this).next(),
                el = $(this);

            menu.find('li').removeClass('open');
            $('.sub-menu').slideUp(200, function() {
                sidebarAndContentHeight();
            });

            sidebarAndContentHeight();

            if (!sub.is(':visible')) {
                $(this).parent('li').addClass('open');
                $(this).next('.sub-menu').slideDown(200, function() {
                    sidebarAndContentHeight();
                });
            } else {
                sub.slideUp(200, function() {
                    sidebarAndContentHeight();
                });
            }
            return false;
        });

        // Handle sidebar menu navigation
        $('.sidebar .accordion-menu li:not(.droplink)').unbind();
        $('.sidebar .accordion-menu li:not(.droplink)').click(function(){
            $('.sidebar .accordion-menu li:not(.droplink)').removeClass("active");
            $(this).addClass("active");
        });

        // Makes .page-inner height same as .page-sidebar height
        var sidebarAndContentHeight = function () {
            var content = $('.page-inner'),
                sidebar = $('.page-sidebar'),
                body = $('body'),
                height,
                footerHeight = $('.page-footer').outerHeight(),
                pageContentHeight = $('.page-content').height();

            content.attr('style', 'min-height:' + sidebar.height() + 'px !important');

            if (body.hasClass('page-sidebar-fixed')) {
                height = sidebar.height() + footerHeight;
            } else {
                height = sidebar.height() + footerHeight;
                if (height  < $(window).height()) {
                    height = $(window).height();
                }
            }

            if (height >= content.height()) {
                content.attr('style', 'min-height:' + height + 'px !important');
            }
        };
        sidebarAndContentHeight();
        window.onresize = sidebarAndContentHeight;

        // Collapse sidebar
        var str = $('.navbar .logo-box a span').text();
        var smTxt = (str.slice(0,1));
        // Logo text on Collapsed Sidebar
        $('.small-sidebar .navbar .logo-box a span').html($('.navbar .logo-box a span').text() == smTxt ? str : smTxt);
        $('.sidebar-toggle').unbind();
        $('.sidebar-toggle').click(function() {
            $('body').toggleClass("small-sidebar");
            $('.navbar .logo-box a span').html($('.navbar .logo-box a span').text() == smTxt ? str : smTxt);
            sidebarAndContentHeight();
        });
    });
}]);

controllersModule.controller('CanvasMenuController', ['$scope', '$rootScope', function($scope, $rootScope){
    $('.cd-nav a').unbind();
    $('.cd-nav a').click(function(){
        var menu = ($(this).parent().data('menu'));
        $rootScope.currentTab = menu;
        $rootScope.$digest();
    });
}]);

controllersModule.controller('ChatController', ['$scope', '$rootScope', 'ChatService', function($scope, $rootScope, ChatService){
    $scope.userChatData = null;
    $rootScope.$watch('userProfile', function(){
        if ($rootScope.userProfile && $rootScope.userProfile.id){
            var userId = $rootScope.userProfile.id;
            var userChatData = ChatService.User.get(userId);
            userChatData.$loaded(function(data){
                if (data.hasOwnProperty('username')){
                    $scope.userChatData = userChatData;
                } else {
                    var userInfo = {
                        username: $rootScope.userProfile.username
                    };
                    ChatService.User.create(userId, userInfo);
                    $scope.userChatData = ChatService.User.get(userId);
                }
            });

        }
    });
}]);