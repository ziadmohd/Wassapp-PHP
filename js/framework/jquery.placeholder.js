/*! http://mths.be/placeholder v2.0.7 by @mathias */
;
(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input'),
		isTextareaSupported = 'placeholder' in document.createElement('textarea'),
		prototype = $.fn,
		placeholder, interval = null;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			var el = $this.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]').not('.placeholder').bind({
				'keydown.placeholder': delayPlaceholder,
				'keypress.placeholder': delayPlaceholder
			}).data('placeholder-enabled', true).each(setPlaceholder);

			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;


		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).remove();
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
			rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}


	function delayPlaceholder(e) {		
		var input = this;
		clearTimeout(interval);
		interval = setTimeout(function() {
			var k = e.which;
			if ($(input).hasClass('placeholder') && !(e.ctrlKey || e.altKey || e.metaKey || k < 32)) {				
				var c = String.fromCharCode(k);
				clearPlaceholder.call(input, e, c);
			} else {
				setPlaceholder.call(input);
			}
		}, 0)
	}

	function clearPlaceholder(event, value) {
		var input = this,
			$input = $(input);
		$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));

		$input.val(value);
		$input.focus();
		$input.caretToEnd();


	}

	function setPlaceholder() {
		var $replacement, input = this,
			$input = $(input),
			$origInput = $input,
			id = this.id;

		if (!$input.val()) {
			try {
				$replacement = $input.clone().attr({
					'type': 'text'
				});
			} catch (e) {
				$replacement = $('<input>').attr($.extend(args(this), {
					'type': 'text'
				}));
			}
			$replacement.removeAttr('name').data({
				'placeholder-password': true,
				'placeholder-id': id
			}).on({
				'keypress.placeholder': delayPlaceholder,
				'focus.placeholder': function() {
					$(this).caretToStart();
				}
			});
			$input.data({
				'placeholder-textinput': $replacement,
				'placeholder-id': id
			}).before($replacement);

			$input = $input.removeAttr('id').hide().prev().attr('id', id).show();

			$input.addClass('placeholder');
			$input.val($input.attr('placeholder')).focus();
		}

	}

}(this, document, jQuery));