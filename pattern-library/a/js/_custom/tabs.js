tabsInit = function() {
	updateMenu = function($tabsContext, tabID, updateSelect) {
		$tabsContext.find('.tabs-menu li').not('[data-id="'+tabID+'"]').removeClass('active');
		$tabsContext.find('.tabs-menu li[data-id="'+tabID+'"]').addClass('active');
		if (updateSelect == true) {
			$tabsContext.children('.ui-select').find('.ui-select-options [data-id="'+tabID+'"]').click();
		}
	}
	updateTabs = function($tabsContext, tabID) {
		var $tabContent = $tabsContext.find('.tabs-tab[data-id="'+tabID+'"] .tabs-tab-content');

		$tabsContext.find('.tabs-tab-content').not($tabContent).hide(function(){
			$tabContent.show();
		});
	}
	updateTitle = function($tabContent) {
		$tabContent.closest('.tabs').find('.tabs-tab-content').not($tabContent).slideUp('fast');
		$tabContent.slideDown('fast');
	}

	$('.tabs').each(function(){
		var $tabsContext = $(this),
			tabItems = [],
			tabsDefault = $('.tabs-tab.active').length ? true : false;

		$tabsContext.addClass('tabs-init')

		if ($tabsContext.hasClass('tabs-filter')) {
			$tabsContext.find('.tabs-menu li').each(function(){
				$(this).attr('data-id',$(this).index());
				tabItems.push('<option>' + $(this).text() + '</option>');
			});

			$('<select />', {
				'class': 'ui-forms',
				html: tabItems.join('')
			}).prependTo($tabsContext).uiForms();

			updateMenu($tabsContext, 0, true);

		} else {
			$tabsContext.prepend('<nav class="tabs-menu"></nav>');

			$tabsContext.find('.tabs-tab').each(function(){
				var tabIndex = $(this).index();
					tabSelected = $(this).hasClass('active') ? 'active' : '';

				$(this).attr('data-id',tabIndex);
				tabItems.push('<li data-id="'+tabIndex+'" class="'+tabSelected+'">' + $(this).find('.tabs-tab-title').html() + '</li>');

				if (tabSelected == 'active') {
					$(this).children('.tabs-tab-content').fadeIn('fast');
				}
			});

			$('<ul />', {
				html: tabItems.join('')
			}).appendTo($tabsContext.find('.tabs-menu'));

			if (tabsDefault == false) {
				$tabsContext.find('.tabs-menu li').first().addClass('active');
				$tabsContext.find('.tabs-tab').first().children('.tabs-tab-content').fadeIn('fast');
			}
		}
	});

	$(document).on('click', '.tabs-tab-title', function(){
		var tabID = $(this).parent('.tabs-tab').index(),
			$tabsContext = $(this).closest('.tabs'),
			$tabContent = $(this).siblings('.tabs-tab-content');

		updateMenu($tabsContext, tabID);
		updateTitle($tabContent);
	});

	$(document).on('click', '.tabs-menu li', function(){
		var tabID = $(this).attr('data-id'),
			$tabsContext = $(this).closest('.tabs');

		updateTabs($tabsContext, tabID);
		updateMenu($tabsContext, tabID, true);
	});

	$(document).on('click', '.tabs-filter .ui-select-options li', function(){
		var tabID = $(this).attr('data-id'),
			$tabsContext = $(this).closest('.tabs');

		updateMenu($tabsContext, tabID);
	});
}