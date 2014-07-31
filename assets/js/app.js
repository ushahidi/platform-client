// Workspace Menu

$(document).ready(function(){
	$('.js-menu-trigger').on('click touchstart', function(e){
		$('.js-menu').toggleClass('is-visible');
		$('.js-menu-screen').toggleClass('is-visible');
		e.preventDefault();
	});

	$('.js-menu-screen').on('click touchstart', function(e){
		$('.js-menu').toggleClass('is-visible');
		$('.js-menu-screen').toggleClass('is-visible');
		e.preventDefault();
	});
});

// Views Submenu
$(document).ready(function(){
	$('.js-views-subnav--link').on('click touchstart', function(e){
		$('.js-views-subnav').toggleClass('subnav');
	});
	// $('.js-views-menu-link').toggleClass('active');
});
