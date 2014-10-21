$.fn.uiForms = function() {
	$(this).each(function(){
		var $nativeControl = $(this),
			uiType;

		// CHECKBOXES
		if ($nativeControl.attr('type') == 'checkbox') {
			// If the checkbox is a toggle switch
			if ($nativeControl.attr('data-ui') == 'toggle-switch') {
				uiType = 'toggle-switch';
				$nativeControl.wrap('<div class="ui-checkbox ui-toggleswitch" />').before('<ul><li>Yes</li><li>No</li></ul>');
			} else {
				$nativeControl.wrap('<div class="ui-checkbox" />').before('<div class="ui-checkbox-checkmark fa fa-check" />');
			}

			if ($nativeControl.is(':checked')) {
				$nativeControl.parent().addClass('checked');
			}

			// When user clicks custom element, click the native control
			$nativeControl.parent('.ui-checkbox').on('click', function(){
				$nativeControl.click();
			});

			// When the native control's value changes, change the custom element
			$nativeControl.on('change', function(){
				$(this).parent('.ui-checkbox').toggleClass('checked');
			});

		// RADIO BUTTONS
		} else if ($nativeControl.attr('type') == 'radio') {
			$nativeControl.wrap('<div class="ui-radio" />');

			if ($nativeControl.is(':checked')) {
				radioCheck($nativeControl);
			}

			if ($nativeControl.is(':disabled')) {
				$(this).parent('.ui-radio').addClass('disabled');
			} else {
				$nativeControl.parent('.ui-radio').on('click', function(){
					if ($(this).hasClass('checked')) {
						radioUncheck($nativeControl);
					} else {
						radioCheck($nativeControl);
					}
				});
			}
		// SELECT CONTROLS
		} else if ($nativeControl.is('select')) {
			$nativeControl.wrap('<div class="ui-select" />').before('<span class="fa fa-caret-down" /><div class="ui-select-selected" /><ul class="ui-select-options" />');
			var $optionsTarget = $nativeControl.siblings('.ui-select-options'),
				label = $('label[for="'+$nativeControl.attr('name')+'"]').length ? '<strong>'+$('label[for="'+$nativeControl.attr('name')+'"]').text()+'</strong> ' : '';

			$nativeControl.children('option').each(function(){
				var optionLabel = $(this).text(),
					optionIndex = $(this).index();

				$(this).attr('data-id', optionIndex);
				$optionsTarget.append('<li data-id="'+optionIndex+'">'+optionLabel+'</li>');

				if ($(this).is(':selected')) {
					$nativeControl.siblings('.ui-select-selected').html(label+optionLabel);
				}
			});

			$('label[for="'+$nativeControl.attr('name')+'"]').hide();

			$nativeControl.siblings().not($optionsTarget).on('click', function(){
				$optionsTarget.fadeToggle('fast');
				$('.ui-select-options').not($optionsTarget).fadeOut('fast');
			});

			$optionsTarget.on('click', 'li', function(){
				$optionsTarget.siblings('select').children('[data-id="'+$(this).attr('data-id')+'"]').prop('selected', true)

				$optionsTarget.children('li').not($(this)).removeClass('selected');
				$(this).addClass('selected');

				$nativeControl.siblings('.ui-select-selected').html(label+$(this).text());
				$optionsTarget.fadeOut('fast');
			});
		}
	});


	radioCheck = function(input) {
		$('input[type="radio"][name="'+$(input).attr('name')+'"]').not(input).parent('.ui-radio').removeClass('checked');
		$(input).prop('checked', true).parent('.ui-radio').addClass('checked');
	}
	radioUncheck = function(input) {
		$(input).prop('checked', false).parent('.ui-radio').removeClass('checked');
	}
}