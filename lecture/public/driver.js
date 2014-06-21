window.Slides = [];

window.render = function() {
  requestAnimationFrame(render);
}

$(function() {
  var $slides        = null;
  var slideIndex     = null;
  var $currentSlide  = null;
  var $previousSlide = null;

  var currentSlideStep = 0;

  var animationDuration = 100;

  function back() {
    if (slideIndex <= 0) {
      // first slide
      return;
    }

    $currentSlide.fadeOut(animationDuration, function() {
      $previousSlide.fadeIn(animationDuration, function() {
        slideIndex -= 1;
        $currentSlide = $previousSlide;
        if (Slides[slideIndex]) { Slides[slideIndex].run($currentSlide); }
        window.location.hash = 'slide' + slideIndex;
      });
    });
  }

  function forward() {
    if (Slides[slideIndex] && Slides[slideIndex].steps && currentSlideStep < Slides[slideIndex].steps.length) {
      Slides[slideIndex].steps[currentSlideStep]($currentSlide);
      currentSlideStep += 1;
      return;
    }

    if (!$slides[slideIndex + 1]) {
      // no more slides
      return;
    }

    $previousSlide = $currentSlide;
    slideIndex += 1;
    $currentSlide = $($slides[slideIndex]);

    $previousSlide.fadeOut(animationDuration, function() {
      $currentSlide.fadeIn(animationDuration);
      if (Slides[slideIndex]) {
        currentSlideStep = 0;
        Slides[slideIndex].run($currentSlide);
      }
      window.location.hash = 'slide' + slideIndex;
    });
  }

  $slides = $('.slide');

  // Initial state
  slideIndex = parseInt(window.location.hash.replace('#slide', '')) || 0;
  console.log(window.location.hash);
  console.log(slideIndex);
  $currentSlide = $($slides[slideIndex]);
  $currentSlide.show();

  if (slideIndex > 0) {
    $previousSlide = $($slides[slideIndex - 1]);
  }

  // Call init javascripts
  for (var i = 0; i < $slides.length; i++) {
    if (Slides[i]) {
      Slides[i].init($($slides[i]));
    }
  }

  // Call first slide's run
  if (Slides[slideIndex]) {
    Slides[slideIndex].run($currentSlide);
  }

  // Start 3d rendering
  render();

  // Slide navigation
  $(document).on('keydown', function(e) {
    if (e.keyCode == 39) { return false; } // right
    if (e.keyCode == 37) { return false; } // left
  });

  $(document).on('keyup', function(e) {
    if (e.keyCode == 39) { forward(); return false; } // right
    if (e.keyCode == 37) { back(); return false; }    // left
  });
});
