toggleInit = function(selector) {
	var elem = selector !== undefined ? selector : '.toggle';

	$(elem).each(function(){
		var $toggleContext = $(this),
			$toggleTrigger = $toggleContext.find('.toggle-trigger'),
			$toggleTarget = $toggleContext.find('.toggle-target');

		if ($toggleContext.attr('data-toggle-type') == 'text') {
			$toggleTrigger.append('<span class="show">Show</span><span class="hide">Hide</span>');
		} else if ($toggleContext.attr('data-toggle-type') == 'cross')  {
			$toggleTrigger.prepend('<i>&#43;</i>');
		}

		if ($toggleContext.attr('data-toggle') == 'closed') {
			$toggleContext.addClass('closed');
			$toggleTarget.hide();
		}

		$toggleTrigger.on('click', function(e){
			$toggleContext.toggleClass('closed');
			$toggleTarget.slideToggle('fast');
			e.preventDefault();
			e.stopImmediatePropagation();
		});
	});
}