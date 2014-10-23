drawerInit = function() {
	$('.drawer-trigger').on('click', function(e){
		if ($(this).attr('data-target') == 'menu') {
			$('.global-header-menu').fadeToggle('fast', function(){
				$(this).toggleClass('visible');
			});
		} else if ($(this).attr('data-target') == 'workspace') {
			$('.global-header-drawer').fadeToggle('fast', function(){
				$(this).toggleClass('visible');
			});
		}
		$(this).toggleClass('active');
		e.preventDefault();
	});
}