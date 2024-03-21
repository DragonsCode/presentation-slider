$(document).ready(function() {
    let currentSlide = 0;
    const totalSlides = $('.slide').length;

    // Display the first slide initially
    $('.slide').eq(0).addClass('active').show();

    // Click event listener for playing animations and switching slides
    $('.slide').on('click', function() {
        const $animationQueue = $(this).find('.animation-queue');
        if ($animationQueue.length) {
            playAnimations($animationQueue);
        }
        const slideIndex = $(this).index();
        if (slideIndex !== currentSlide) {
            navigateSlide(slideIndex);
        }
    });

    // Keyboard event listener for slide navigation
    $(document).keydown(function(event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            navigateSlide(currentSlide + 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            navigateSlide(currentSlide - 1);
        }
    });

    // Function to navigate between slides
    function navigateSlide(newSlide) {
        if (newSlide >= 0 && newSlide < totalSlides) {
            $('.slide').eq(currentSlide).removeClass('active').css('transform', 'translateX(-100%)');
            $('.slide').eq(newSlide).addClass('active').css('transform', 'translateX(0)');
            currentSlide = newSlide;
        }
    }

    // Function to play animations by toggling classes
    function playAnimations($animationQueue) {
        const animations = $animationQueue.find('.animation');
        if (animations.length) {
            animations.each(function(index) {
                const $animatedElement = $(this);
                setTimeout(function() {
                    $animatedElement.addClass('animate');
                }, index * 1000); // Adjust delay as needed
            });
        }
    }
});
