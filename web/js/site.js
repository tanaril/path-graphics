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

        $nav.children('div.top').width(($nav.width()-82)/2);

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
                marginTop = (height - containerHeight)/2  - $nav.height();
            }
            // Make sure the content stays within the page
            if ( marginTop < 0 ) {
                marginTop = 0;
            }
            // Use padding instead of margin due to the background
            if ( $(this).attr('id') == 'homepage' ) {
                $container.css({'padding-top': marginTop});
            } else {
                $container.css({'padding-top': marginTop});
            }
            // Set the minimum height of the page.
            $(this).css({"min-height": height});
        });

        windowHeight = $window.height();
    });

    // Trigger the resize when the page is loaded
    $window.trigger('resize');

    $('form').on('submit', function(event) {
        event.preventDefault();

        $('#failure').hide();
        $.post('/mail.php', {from: $(this).find('input[name=from]').val(), from_email: $(this).find('input[name=email]').val(), message: $(this).find('textarea[name=message]').val()}, function(result) {
            if ( result.success ) {
                $('form').hide();
                $('#success').show();
            } else {
                $('#failure').show();
            }
        }, 'json');
    });
    // Storage flag to see if the browser is already scrolling or not
    var autoScroll = false;

    /**
     * Have the navigation links scroll smoothly to their page.
     */
    $(".buttons a, nav a").on("click", function(event) {
        // get the name of the target where the user wants to be directed to
        var $target = $($(this).attr('href'));

        if ( $target ) {
			
        // Don't follow the default behavior of redirecting to the page in the href
        event.preventDefault();
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
                $window.trigger('resize');
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