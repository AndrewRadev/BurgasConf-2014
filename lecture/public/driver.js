window.Slides = [];

$.fn.dump = function() {
  $this = $(this)
  console.log($this);
  return $this;
};

$(function() {
  var $slides        = null;
  var slideIndex     = null;
  var $currentSlide  = null;
  var $previousSlide = null;

  var animationDuration = 100;

  function previousSlide() {
    if (slideIndex <= 0) {
      // first slide
      return;
    }

    $currentSlide.fadeOut(animationDuration, function() {
      $previousSlide.fadeIn(animationDuration, function() {
        slideIndex -= 1;
        $currentSlide = $previousSlide;
        if (Slides[slideIndex]) { Slides[slideIndex].run($currentSlide); }
      });
    });
  }

  function nextSlide() {
    if (!$slides[slideIndex + 1]) {
      // no more slides
      return;
    }

    $previousSlide = $currentSlide;
    slideIndex += 1;
    $currentSlide = $($slides[slideIndex]);

    $previousSlide.fadeOut(animationDuration, function() {
      $currentSlide.fadeIn(animationDuration);
      if (Slides[slideIndex]) { Slides[slideIndex].run($currentSlide); }
    });
  }

  $slides = $('.js-slide');

  // Initial state
  slideIndex = 0;
  $currentSlide = $($slides[0]);
  $currentSlide.show();

  // Call init javascripts
  for (var i = 0; i < $slides.length; i++) {
    if (Slides[i]) {
      Slides[i].init($($slides[i]));
    }
  }

  // Slide navigation
  $(document).on('keyup', function(e) {
    if (e.keyCode == 32) { nextSlide(); }     // space
    if (e.keyCode == 39) { nextSlide(); }     // right
    if (e.keyCode == 37) { previousSlide(); } // left
  });
});
