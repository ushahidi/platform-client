$(document).ready(function(){

// Workspace Menu
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

// Views Submenu
	$('.js-views-subnav--link').on('click touchstart', function(e){
		$('.js-views-subnav').toggleClass('subnav');
	});
	// $('.js-views-menu-link').toggleClass('active');

//Dropdown Button
	$('.dropdown-button').on('click touchstart', function(e){
		$(this).nextAll('.menu').toggleClass('show-menu');
		$('.menu > li').on('click touchstart', function(e){
		$(this).closest('.menu').removeClass('show-menu');
		});
	});

// Accordion Tabs
	$('.accordion-tabs').each(function(index) {
		$(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
	});

	$('.accordion-tabs').on('click', 'li > a', function(event) {
		if (!$(this).hasClass('is-active')) {
			event.preventDefault();
			var accordionTabs = $(this).closest('.accordion-tabs')
			accordionTabs.find('.is-open').removeClass('is-open').hide();

			$(this).next().toggleClass('is-open').toggle();
			accordionTabs.find('.is-active').removeClass('is-active');
			$(this).addClass('is-active');
		} else {
			event.preventDefault();
		}
	});

});
