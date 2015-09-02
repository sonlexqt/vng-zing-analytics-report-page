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

    // Slimscroll
    $('.slimscroll').slimscroll({
        allowPageScroll: true
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
    //$('.showRight2').click(function() {
    //    classie.toggle( menuRight2, 'cbp-spmenu-open' );
    //});
    //$(".chat-write form input").keypress(function (e) {
    //    if ((e.which == 13)&&(!$(this).val().length == 0)) {
    //        $('<div class="chat-item chat-item-right"><div class="chat-message">' + $(this).val() + '</div></div>').insertAfter(".chat .chat-item:last-child");
    //        $(this).val('');
    //    } else if(e.which == 13) {
    //        return;
    //    }
    //    $('.chat').slimscroll({
    //        allowPageScroll: true
    //    });
    //});
});