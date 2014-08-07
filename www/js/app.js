(function($) {

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
	$('.js-views-subnav--link').on('click touchstart', function(){
		$('.js-views-subnav').toggleClass('subnav');
	});
	// $('.js-views-menu-link').toggleClass('active');

//Dropdown Button
	$('.dropdown-button').on('click touchstart', function(){
		$(this).nextAll('.menu').toggleClass('show-menu');
		$('.menu > li').on('click touchstart', function(){
		$(this).closest('.menu').removeClass('show-menu');
		});
	});

// Accordion Tabs - Global

	$('.accordion-tabs').each(function() {
		$(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
	});

	$('.accordion-tabs').on('click', 'li > a', function(event) {
		if (!$(this).hasClass('is-active')) {
			event.preventDefault();
			var accordionTabs = $(this).closest('.accordion-tabs');
			accordionTabs.find('.is-open').removeClass('is-open').hide();


			$(this).next().toggleClass('is-open').toggle();
			accordionTabs.find('.is-active').removeClass('is-active');
			$(this).addClass('is-active');
		} else {
			event.preventDefault();
		}
	});


// Accordion Tabs - Search Bar

	$('.accordion-tabs--search-bar').on('click', 'li > a', function(event) {
		if (!$(this).hasClass('is-active')) {
			event.preventDefault();
			var accordionTabs = $(this).closest('.accordion-tabs--search-bar');
			accordionTabs.find('.is-open').removeClass('is-open').hide();


			$(this).next().toggleClass('is-open').toggle();
			accordionTabs.find('.is-active').removeClass('is-active');
			$(this).addClass('is-active');
		} else {
			$(this).toggleClass('is-active');
			$(this).next().toggleClass('is-open').toggle();
			event.preventDefault();
		}
	});

// Search Tools

	var Filter = (function() {
		function Filter(element) {
				this._element = $(element);
				this._optionsContainer = this._element.find(this.constructor.optionsContainerSelector);
			}

		Filter.selector = '.filter';
		Filter.optionsContainerSelector = '> div';
		Filter.hideOptionsClass = 'hide-options';

		Filter.enhance = function() {
			var Klass = this;

			return $(Klass.selector).each(function() {
				return new Klass(this).enhance();
			});
		};

		Filter.prototype.enhance = function() {
			this._buildUI();
			this._bindEvents();
		};

		Filter.prototype._buildUI = function() {
			this._summaryElement = $('<label></label>').
				addClass('summary').
				attr('data-role', 'summary').
				prependTo(this._optionsContainer);

			this._clearSelectionButton = $('<button></button>').
				text('Clear').
				attr('type', 'button').
				insertAfter(this._summaryElement);

			this._optionsContainer.addClass(this.constructor.hideOptionsClass);
			this._updateSummary();
		};

		Filter.prototype._bindEvents = function() {
			var self = this;

			this._summaryElement.click(function() {
				self._toggleOptions();
			});

			this._clearSelectionButton.click(function() {
				self._clearSelection();
			});

			this._checkboxes().change(function() {
				self._updateSummary();
			});

			$('body').click(function(e) {
				var inFilter = $(e.target).closest(self.constructor.selector).length > 0;

				if (!inFilter) {
					self._allOptionsContainers().addClass(self.constructor.hideOptionsClass);
				}
			});
		};

		Filter.prototype._toggleOptions = function() {
			this._allOptionsContainers().
				not(this._optionsContainer).
				addClass(this.constructor.hideOptionsClass);

			this._optionsContainer.toggleClass(this.constructor.hideOptionsClass);
		};

		Filter.prototype._updateSummary = function() {
			var summary = 'All';
			var checked = this._checkboxes().filter(':checked');

			if (checked.length > 0) {
				summary = this._labelsFor(checked).join(', ');
			}

			this._summaryElement.text(summary);
		};

		Filter.prototype._clearSelection = function() {
			this._checkboxes().each(function() {
				$(this).prop('checked', false);
			});

			this._updateSummary();
		};

		Filter.prototype._checkboxes = function() {
			return this._element.find(':checkbox');
		};

		Filter.prototype._labelsFor = function(inputs) {
			return inputs.map(function() {
				var id = $(this).attr('id');
				return $('label[for="' + id + '"]').text();
			}).get();
		};

		Filter.prototype._allOptionsContainers = function() {
			return $(this.constructor.selector + ' ' + this.constructor.optionsContainerSelector);
		};

		return Filter;
		})();

	$(function() {
		Filter.enhance();
	});


})(jQuery);
