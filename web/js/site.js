$(document).ready(function() {
    var scrollEnabled = false;

    /**
     * Resize pages based on the height of the viewport
     */
    jQuery(window).resize(function() {

        $("nav").children('div').width(($("nav").width()-82)/2);

        // Get the height of the viewport
        var height = jQuery(window).height();
        // set the minimum height for every .page
        $.each($(".page"), function(index, element) {
            // Find the actual content of the page
            var $container = $(this).find(".container");
            // Find the navigation of the page
            var $nav = $('nav');
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
    });

    // Trigger the resize when the page is loaded
    $(window).trigger('resize');

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

        // Remove the active flag from the old page.
        $target.siblings('.active').removeClass('active');

        $.each($target.siblings('.page'), function(index, page) {
            $('nav').removeClass($(page).attr('id'));
        });
        $('nav').addClass($target.attr('id'));
        // Block futher scrolling till the auto scroll is finished
        autoScroll = true;
        // Scroll
        $('html, body').animate({
            scrollTop: $target.offset().top
        }, 2000, 'swing', function() {
            // Set the new page as the active page
            $target.addClass('active');
            // Re-enable scrolling when finished
            autoScroll = false;
        });
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
        var currentScroll = $(window).scrollTop();

        var $homepage = $('#homepage');
        if ( $homepage ) {
            var $nav = $('nav');


            var $portfolio = $('#portfolio');

            var $about = $('#about');

            var $contact = $('#contact');
            var $buttons = $('#homepage .buttons');
            if ( currentScroll <= $("#portfolio").offset().top ) {
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
            }
        }
    };

    $(window).on("scroll",function(event) {

        // Block scroll if the auto scroll is active
        event.preventDefault();
        event.stopImmediatePropagation();

        onScroll();
    });

    /**
     * Single scroll to scroll to the next page.
     */
    function scroll(scrollDelta) {
        // Check if it's not already scrolling
        if ( !autoScroll ) {
            var $nav = $('nav');
            var $homepage = $('#homepage');
            var $buttons = $('#homepage .buttons');

            // Get the current scroll position
            var currentScroll = $(this).scrollTop();

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
                // Flag to check if we need to scroll to the next page
                var scroll = true;
                // Height of the visual page
                var viewportHeight = $(window).height();
                // Top position of the current page
                var pageTop = $current.offset().top;
                // Check if the page is lager than the viewport and that the scroll position is larger than the top
                if ( $current.height() > $(window).height() ) {
                    // Absolute bottom of the page
                    var pageBottom = pageTop + $current.height();
                    // Bottom of the visual page
                    var viewportBottom = currentScroll+viewportHeight;

                    // check if the viewport doesn't display a new page
                    if ( (currentScroll > pageTop || scrollDelta > 0) && ( viewportBottom < pageBottom-20 || scrollDelta < 0) ) {
                        // Calculate the new visuable pag
                        var scrollTo = scrollDelta < 0?currentScroll - viewportHeight:currentScroll + viewportHeight;
                        // Prevent the scroll to go outside of the bounds of the current page
                        if ( scrollTo < pageTop ) scrollTo = pageTop;
                        // Stop scroll at the bottom of the current page
                        if ( scrollTo+viewportHeight > pageBottom ) scrollTo = pageBottom - viewportHeight;

                        // Block user scrolling
                        autoScroll = true;

                        // Scroll
                        $('html, body').animate({
                            scrollTop: scrollTo
                        }, {
                            queue: false,
                            duration: 1500,
                            easing: 'linear',
                            done: function() {
                                setTimeout(function() {
                                    // Set the location hash correctly
                                    //window.location.hash = $target.attr('id') != 'homepage'?$target.attr('id'):null;

                                    // Re-enable user scrolling
                                    autoScroll = false;
                                }, 100);
                            }
                        });
                        // Disable scrolling to the next page
                        scroll = false;

                    }
                }
                // Check if we need to scroll to the next page
                if ( scroll ) {
                    var $target;

                    // Determine scroll direction
                    if (scrollDelta > 0){
                        // Get the next page
                        $target = $current.next('.page');
                    } else {
                        // Get the previous page
                        $target = $current.prev('.page');
                    }

                    // Check if the target exists
                    if ( $target.length > 0 ) {
                        // Remove the active flag from the old page.
                        $target.siblings('.active').removeClass('active');

                        $.each($target.siblings('.page'), function(index, page) {
                            $nav.removeClass($(page).attr('id'));
                        });
                        $nav.addClass($target.attr('id'));
                        // Block user scrolling
                        autoScroll = true;
                        // Set the new page as the active page
                        $target.addClass('active');

                        // Scroll
                        $('html, body').animate({
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
                                }, 100);
                            }
                        });
                    }
                }
            }
        } else {
        };
    }

    //Firefox
    $(window).on('DOMMouseScroll', function(event){
        if ( scrollEnabled ) {
            return true;
        } else {
            event.preventDefault();
            scroll(event.originalEvent.detail*-1);
            return false;
        }
    });

    //IE, Opera, Safari
    $(window).on('mousewheel', function(event){
        if ( scrollEnabled ) {
            return true;
        } else {
            event.preventDefault();
            scroll(event.originalEvent.wheelDelta*-1);
            return false;
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
/*
    $("#contact textarea").on('focus', function() {
        if ( $(this).val() == 'Your message...' ) {
            $(this).val('')
            $(this).css('color', '#fff');
        }
    });
    $("#contact textarea").on('blur', function() {
        if ( $(this).val() == '' ) {
            $(this).val('Your message...');
            $(this).css('color', '#808080');
        }
    });*/

    $('#portfolio .projects a').on('click', function(event) {
        event.preventDefault();
        var scrollPosition = $(window).scrollTop();
        var $body = $('body > div.content');
        var $this = $(this);
        $.get($(this).attr('href'), function(data) {
            var body = $(data);
            var $newBody = $('<div></div>').append(body);
            $newBody.insertAfter($body);
            $body.hide();

            var close = function() {

                $body.show();
                $newBody.remove();
                scrollEnabled = false;
                $('html, body').animate({
                    scrollTop: scrollPosition
                }, {
                    queue: false,
                    duration: 1,
                    easing: 'linear'
                });
            }
            $newBody.find('a.cancel').on('click', function(event) {
                event.preventDefault();
                close();
            });

            $newBody.find('a.next').on('click', function(event) {
                event.preventDefault();
                close();
                $this.closest('li').next().find('a').trigger('click');
            });
            $newBody.find('a.previous').on('click', function(event) {
                event.preventDefault();
                close();
                $this.closest('li').prev().find('a').trigger('click');
            });
            if ( $this.closest('li').prev().length == 0 || $this.closest('li').prev().find('a').length == 0 ) {
                $newBody.find('a.previous').remove();
            }
            if ( $this.closest('li').next().length == 0 || $this.closest('li').next().find('a').length == 0 ) {
                $newBody.find('a.next').remove();
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