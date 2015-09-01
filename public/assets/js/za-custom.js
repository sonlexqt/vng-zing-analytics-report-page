google.setOnLoadCallback(function() {
    angular.bootstrap(document, ['zaApp']);
});
google.load('visualization', '1', {'packages': ['geochart']});

$(document).ready(function() {
    // Fullscreen
    function toggleFullScreen() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    angular.element('.toggle-fullscreen').click(function(){
        toggleFullScreen();
    });

    // Waves
    Waves.displayEffect();

    // Tooltips
    $( '[data-toggle~="tooltip"]').tooltip({
        container: 'body'
    });

    // Switchery
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function(html) {
        var switchery = new Switchery(html, { color: '#23B7E5' });
    });

    // Panel Control
    $('.panel-collapse').click(function(){
        $(this).closest(".panel").children('.panel-body').slideToggle('fast');
    });

    $('.panel-remove').click(function(){
        $(this).closest(".panel").hide();
    });

    // Push Menu
    $('.push-sidebar').click(function(){
        var hidden = $('.sidebar');

        if (hidden.hasClass('visible')){
            hidden.removeClass('visible');
            $('.page-inner').removeClass('sidebar-visible');
        } else {
            hidden.addClass('visible');
            $('.page-inner').addClass('sidebar-visible');
        }
    });

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

    // Slimscroll
    $('.slimscroll').slimscroll({
        allowPageScroll: true
    });

    // Sidebar Menu
    $('.sidebar .accordion-menu li .sub-menu').slideUp(0);
    $('.sidebar .accordion-menu li.open .sub-menu').slideDown(0);
    $('.small-sidebar .sidebar .accordion-menu li.open .sub-menu').hide(0);
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
    $('.sidebar-toggle').click(function() {
        $('body').toggleClass("small-sidebar");
        $('.navbar .logo-box a span').html($('.navbar .logo-box a span').text() == smTxt ? str : smTxt);
        sidebarAndContentHeight();
    });

    // Chat sidebar
    var menuRight = document.getElementById( 'cbp-spmenu-s1' );
    var showRight = document.getElementById( 'showRight' );
    var closeRight = document.getElementById( 'closeRight' );
    var menuRight2 = document.getElementById( 'cbp-spmenu-s2' );
    var closeRight2 = document.getElementById( 'closeRight2' );
    showRight.onclick = function() {
        classie.toggle( menuRight, 'cbp-spmenu-open' );
    };
    closeRight.onclick = function() {
        classie.toggle( menuRight, 'cbp-spmenu-open' );
    };
    closeRight2.onclick = function() {
        classie.toggle( menuRight2, 'cbp-spmenu-open' );
    };
    $('.showRight2').click(function() {
        classie.toggle( menuRight2, 'cbp-spmenu-open' );
    });
    $(".chat-write form input").keypress(function (e) {
        if ((e.which == 13)&&(!$(this).val().length == 0)) {
            $('<div class="chat-item chat-item-right"><div class="chat-message">' + $(this).val() + '</div></div>').insertAfter(".chat .chat-item:last-child");
            $(this).val('');
        } else if(e.which == 13) {
            return;
        }
        $('.chat').slimscroll({
            allowPageScroll: true
        });
    });
});