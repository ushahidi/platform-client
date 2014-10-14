removePattern = function() {
	$(document).on('click', '.removable-trigger', function(){
		$(this).closest('.removable').fadeOut('fast', function(){
			$(this).remove();
		});
	});
}