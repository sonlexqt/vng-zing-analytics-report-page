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

controllersModule.controller('ChatController', ['$scope', '$rootScope', '$http', 'ChatService', function($scope, $rootScope, $http, ChatService){
    $scope.otherUsers = [];
    $scope.currentOpponent = null;
    $scope.currentOpponentConversation = null;

    $rootScope.$watch('userProfile', function(){
        if ($rootScope.userProfile && $rootScope.userProfile.id){
            $http.get('/users').success(function(data){
                $scope.otherUsers = removeElementFromArray(data, "id", $rootScope.userProfile.id);
            });
        }
    });

    $scope.startChatting = function(thatUser){
        var menuRight2 = document.getElementById( 'cbp-spmenu-s2' );
        classie.toggle(menuRight2, 'cbp-spmenu-open');
        var conversationWithThatUser = ChatService.Conversation.getConversationWithThatUser($rootScope.userProfile.username, thatUser.username);
        conversationWithThatUser.$loaded(function(data){
            if (data.length){
                // already has a conversation with that user, do nothing
            } else {
                // haven't chat before, now create a new conversation
                ChatService.Conversation.create($rootScope.userProfile.username, thatUser.username);
            }
            $scope.currentOpponent = thatUser.username;
            $scope.currentOpponentConversation = conversationWithThatUser;
            $scope.currentOpponentConversation.$watch(function(data){
                if (data.event == "child_added"){
                    var key = data.key;
                    var newMessage = ChatService.Message.getMessage($rootScope.userProfile.username, $scope.currentOpponent, key);
                    newMessage.$loaded(function(message){
                        if (newMessage.sender !== $rootScope.userProfile.username){
                            toastr.options = {
                                "positionClass": "toast-top-center",
                                "onclick": function(){
                                    classie.add(menuRight2, 'cbp-spmenu-open');
                                    var newConversationWithThatUser = ChatService.Conversation.getConversationWithThatUser($rootScope.userProfile.username, newMessage.sender);
                                    newConversationWithThatUser.$loaded(function(data){
                                        $scope.currentOpponentConversation = newConversationWithThatUser;
                                        $scope.currentOpponent = newMessage.sender;
                                    });
                                }
                            };
                            // Play message notification sound
                            document.getElementById("message-notification").play();
                            // Display notification
                            toastr.success(newMessage.msg, newMessage.sender);
                        }
                    });
                }
            });
        });
    };

    $scope.sendMessage = function($event, chatMessage){
        if ($event.keyCode === 13 && chatMessage && chatMessage.length > 0){ // The Enter key
            ChatService.Conversation.addMessage($rootScope.userProfile.username, $scope.currentOpponent, chatMessage);
            angular.element('#chat-msg-input').val('');
        }
        $('.chat').slimscroll({
            allowPageScroll: true
        });
    };

}]);