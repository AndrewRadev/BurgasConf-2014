Slides[1] = {
  init: function($el) {
    $el.dump();
    console.log('init slide 1');
  },

  steps: [
    function($el) { $el.appear(0); },
    function($el) { $el.appear(1); },
    function($el) { $el.appear(2); }
  ],

  run: function($el) {
    $el.dump();
    console.log('run slide 1');
  }
};
