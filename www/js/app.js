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

});
