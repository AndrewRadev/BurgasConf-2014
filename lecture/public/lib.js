$.fn.dump = function() {
  var $this = $(this)
  console.log($this);
  return $this;
};

$.fn.appear = function(index) {
  var $el = $(this);

  $items = $el.find('.appear');
  $item = $($items[index]);

  $item.fadeIn(200);
};

$.fn.highlight = function(index) {
  var $el = $(this);

  // first, unhighlight everything
  $el.find('[class*=hl-]').animate({
    color:         $.Color('#333'),
    'font-weight': 300
  }, 100);

  // then, highlight the given indices
  if (index) {
    $el.find('.hl-' + index).animate({
      color:         $.Color('red'),
      'font-weight': 700
    }, 100);
  }
};
