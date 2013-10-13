$(document).ready(function() {
    var scrollEnabled = false;
    var windowHeight = 0;
    var $body = $('html, body');
    var $window = $(window);
    var $homepage = $('#homepage');
    var $nav = $('nav');
    var $buttons = $('#homepage .buttons');
    var $portfolio = $('#portfolio');
    var $about = $('#about');
    var $contact = $('#contact');
    var $pages = $('.page');


    /**
     * Resize pages based on the height of the viewport
     */
     $window.resize(function() {

        $nav.children('div').width(($nav.width()-82)/2);

        // Get the height of the viewport
        var height = jQuery(window).height();
        // set the minimum height for every .page
        $.each($pages, function(index, element) {
            // Find the actual content of the page
            var $container = $(this).find(".container");
            // Get the content height
            var containerHeight = $container.height();
            // Calculate the top margin
            var marginTop = 0;
            // Check if there is a navigation
            if ( $(this).attr('id') == 'homepage' ) {
                // Calculate the top margin
                marginTop = (height - containerHeight)/2;
            } else {
                // Take into account the navigation when calculating the top margin
                marginTop = (height - containerHeight)/2;
            }
            // Make sure the content stays within the page
            if ( marginTop < 0 ) {
                marginTop = 0;
            }
            // Use padding instead of margin due to the background
            if ( $(this).attr('id') == 'homepage' ) {
                $container.css({'paddig-top': marginTop + $container.css("padding-top")});
            } else {
                $container.css({'padding-top': marginTop < $nav.height() ? $nav.height() : marginTop});
            }
            // Set the minimum height of the page.
            $(this).css({"min-height": height});
        });

        windowHeight = $window.height();
    });

    // Trigger the resize when the page is loaded
    $window.trigger('resize');

    // Storage flag to see if the browser is already scrolling or not
    var autoScroll = false;

    /**
     * Have the navigation links scroll smoothly to their page.
     */
    $(".buttons a, nav a").on("click", function(event) {
        // Don't follow the default behavior of redirecting to the page in the href
        event.preventDefault();
        // get the name of the target where the user wants to be directed to
        var $target = $($(this).attr('href'));

        if ( $target ) {
            // Block futher scrolling till the auto scroll is finished
            autoScroll = true;
            // Scroll
            $body.animate({
                scrollTop: $target.offset().top
            }, 2000, 'swing', function() {
                // Re-enable scrolling when finished
                autoScroll = false;
            });
        }
    });
    /*$('#nav-helper').on('activate.bs.scrollspy', function () {
     $this = $(this);
     $.each($this.find('a'), function(index, a) {
     $this.removeClass($(a).attr('href').replace('#', ''));
     });
     $this.addClass($this.find('.active a').attr('href').replace('#', ''));
     });*/

    var navVisible = -1;
    var onScroll = function() {

        // Get the current scroll position
        var currentScroll = $window.scrollTop();

        if ( currentScroll <= $portfolio.offset().top ) {
            var pos = (currentScroll-($buttons.offset().top + $buttons.height()))/($homepage.height()-($buttons.offset().top + $buttons.height()));
            if ( pos < 0.05 ) {
                $nav.css('opacity', 0);
                $nav.css('display', 'none');
            } else {
                $nav.css('display', 'block');
                $nav.css('opacity', pos > 1?1:pos);
            }
        } else {
            $nav.css('display', 'block');
            $nav.css('opacity', 1);

            $.each($pages, function(index, page) {
                $nav.removeClass($(page).attr('id'));
            });

            if ( currentScroll < $portfolio.offset().top ) {
                $homepage.siblings('.active').removeClass('active');
                $homepage.addClass('active');

                $nav.addClass('homepage');
            } else if ( currentScroll >= $portfolio.offset().top && currentScroll < $about.offset().top) {
                $portfolio.siblings('.active').removeClass('active');
                $portfolio.addClass('active');

                $nav.addClass('portfolio');
            } else if ( currentScroll >= $about.offset().top && currentScroll < $contact.offset().top ) {
                $about.siblings('.active').removeClass('active');
                $about.addClass('active');

                $nav.addClass('about');
            } else if ( currentScroll >= $contact.offset().top ) {

                $contact.siblings('.active').removeClass('active');
                $contact.addClass('active');

                $nav.addClass('contact');
            }
        }
    };

    $(window).on("scroll",function(event) {

        // Block scroll if the auto scroll is active
        event.preventDefault();
        event.stopImmediatePropagation();


        if ( $('.project').length > 0 ) {

            var currentScroll = $window.scrollTop();

            if ( currentScroll > $('.project').find('header').height() && (currentScroll + $(window).height()) < $('.project').find('footer').offset().top ) {
                $('a.leftarrow').show(); $('a.rightarrow').show();
            } else {
                $('a.leftarrow').hide(); $('a.rightarrow').hide();
            }
        } else {
            onScroll();
        }
    });




    /**
     * Single scroll to scroll to the next page.
     */
    function scroll(scrollDelta) {
            // Get the current scroll position
            var currentScroll = $window.scrollTop();

            if ( currentScroll <= 0 && scrollDelta <= 0 ) {
//                /return false;
            }
            if ( currentScroll >= $contact.offset().top && scrollDelta > 0 ) {
//                return false;
            }

            // Find the currently active navigation item
            var $current = $(".page.active");
            if ( $current.length <= 0 ) {
                // If a hash tag is set in the url activate that page
                if ( window.location.hash ) {
                    $current = $(window.location.hash).addClass('active');
                } else {
                    // if nothing is set select the first one.
                    $current = $('.page').first().addClass('active');
                }
            }
            // Check if there is an active navigation item
            if ( $current ) {
                var $target;

                // Top position of the current page
                var pageTop = $current.offset().top;
                var currentHeight = $current.height();
                // Absolute bottom of the page
                var pageBottom = pageTop + currentHeight;

                // Determine scroll direction
                if (scrollDelta > 0){
                    // Get the next page
                    $target = $current.next('.page');
                    if ( currentScroll + windowHeight > pageBottom && $target.length > 0 ) {

                        $target.siblings('.active').removeClass('active');
                        $target.addClass('active');

                        // Scroll
                        $body.animate({
                            scrollTop: $target.offset().top
                        }, {
                            queue: false,
                            duration: 1500,
                            easing: 'linear',
                            progress: onScroll,
                            done: function() {
                                setTimeout(function() {
                                    // Re-enable user scrolling
                                    autoScroll = false;
                                }, 400);
                            }
                        });
                        return true;
                    }
                } else {
                    // Get the previous page
                    $target = $current.prev('.page');
                    if ( currentScroll <= pageTop && $target.length > 0) {

                        $target.siblings('.active').removeClass('active');
                        $target.addClass('active');

                        // Scroll
                        $body.animate({
                            scrollTop: $target.offset().top
                        }, {
                            queue: false,
                            duration: 1500,
                            easing: 'linear',
                            progress: onScroll,
                            done: function() {
                                setTimeout(function() {
                                    // Re-enable user scrolling
                                    autoScroll = false;
                                }, 400);
                            }
                        });
                        return true;
                    }
                }
            }
    }

    $(window).on('mousewheel DOMMouseScroll', function (e) {
        if ( scrollEnabled ) {
            return true;
        } else {
            e.preventDefault();
            e.delta = null;
            if (e.originalEvent) {
                if (e.originalEvent.wheelDelta) e.delta = e.originalEvent.wheelDelta / -40;
                if (e.originalEvent.deltaY) e.delta = e.originalEvent.deltaY;
                if (e.originalEvent.detail) e.delta = e.originalEvent.detail;
            }

            // Check if it's not already scrolling
            if ( !autoScroll ) {
                autoScroll = true;
                if ( !scroll(e.delta) ) {
                    autoScroll = false;
                }
            }
            return false
        }
    });

    /**
     * Portfolio
     */
        // When the mouse goes over the li
    $("#portfolio li").on('mouseover', function() {
        // Add class "active" to li
        $(this).addClass("active");
    });
    // When the mouse leaves the li
    $("#portfolio li").on('mouseleave', function() {
        // Remove class "active" from li
        $(this).removeClass("active");
    });

    var scrollPosition = null;
    $('#portfolio .projects a').on('click', function(event) {
        event.preventDefault();
        if ( null === scrollPosition ) { scrollPosition = $(window).scrollTop(); }
        var $body = $('body > div.content');
        var $this = $(this);
        $.get($(this).attr('href'), function(data) {
            var body = $(data);
            var $newBody = $('<div></div>').append(body);
            $newBody.insertAfter($body);
            $body.hide();

            $newBody.find('a.cancel').on('click', function(event) {
                event.preventDefault();
                $body.siblings().remove();
                $body.show();
                scrollEnabled = false;
                $('html, body').animate({
                    scrollTop: scrollPosition
                }, {
                    queue: false,
                    duration: 1,
                    easing: 'linear'
                });
                scrollPosition = null;
            });

            $('a.leftarrow').hide(); $('a.rightarrow').hide();

            $newBody.find('a.next, a.rightarrow').on('click', function(event) {
                event.preventDefault();
                $newBody.remove();
                $this.closest('li').next().find('a').trigger('click');
            });
            $newBody.find('a.previous, a.leftarrow').on('click', function(event) {
                event.preventDefault();
                $newBody.remove();
                $this.closest('li').prev().find('a').trigger('click');
            });
            if ( $this.closest('li').prev().length == 0 || $this.closest('li').prev().find('a').length == 0 ) {
                $newBody.find('a.previous, a.leftarrow').remove();
            }
            if ( $this.closest('li').next().length == 0 || $this.closest('li').next().find('a').length == 0 ) {
                $newBody.find('a.next, a.rightarrow').remove();
            }

            scrollEnabled = true;
            $('html, body').animate({
                scrollTop: 0
            }, {
                queue: false,
                duration: 1,
                easing: 'linear'
            });
        });
    });
});