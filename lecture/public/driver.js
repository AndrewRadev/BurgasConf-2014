window.Slides = [];
window.Demos = {};

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
        $currentSlide = $($slides[slideIndex]);
        $previousSlide = $($slides[slideIndex - 1]);
        currentSlideStep = 0;
        if (Slides[slideIndex] && Slides[slideIndex].run) { Slides[slideIndex].run($currentSlide); }
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

      if (!Slides[slideIndex] && $currentSlide.find('.appear').length) {
        // we have things that will show up one at a time
        Slides[slideIndex] = {
          steps: [],
        };
        $currentSlide.find('.appear').each(function(i) {
          (function(i) {
            Slides[slideIndex].steps.push(function($el) {
              $el.appear(i);
            });
          })(i);
        });
      }

      if (!Slides[slideIndex] && $currentSlide.find('.hl-0').length) {
        // we have steps to highlight
        Slides[slideIndex] = {
          steps: [],
        };
        var hlMaxIndex = 0;
        $currentSlide.find('span[class^="hl-"]').each(function(i, el) {
          hlIndex = parseInt($(el).attr('class').replace('hl-', ''));
          if (hlIndex > hlMaxIndex) {
            hlMaxIndex = hlIndex
          }
        });

        for (var i = 0; i <= hlMaxIndex; i++) {
          (function(i) {
            Slides[slideIndex].steps.push(function($el) {
              $el.highlight(i.toString());
            });
          })(i);
        }
      }

      if (Slides[slideIndex]) {
        currentSlideStep = 0;

        if (Slides[slideIndex].run) {
          Slides[slideIndex].run($currentSlide);
        }
      }

      window.location.hash = 'slide' + slideIndex;
    });
  }

  $slides = $('.slide');

  // Initial state
  slideIndex = parseInt(window.location.hash.replace('#slide', '')) || 0;
  $currentSlide = $($slides[slideIndex]);
  $currentSlide.show();

  if (slideIndex > 0) {
    $previousSlide = $($slides[slideIndex - 1]);
  }

  // Call init javascripts
  for (var i = 0; i < $slides.length; i++) {
    if (Slides[i] && Slides[i].init) {
      Slides[i].init($($slides[i]));
    }
  }

  // Call first slide's run
  if (Slides[slideIndex] && Slides[slideIndex].run) {
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
