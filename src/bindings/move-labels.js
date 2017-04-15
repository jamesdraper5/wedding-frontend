import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.moveLabels = {

	init: (element, valueAccessor) => {

		var subscriptions = [];
		var $el = $(element);
		var ticker;

		// Forms where the labels move up when you type
		function moveLabel(field,force) {
			var val = field.val().length;
			var $label = field.siblings('label');
			if ( !$label.length ) {
				return;
			}
			if ( val || force ) {
				$label.addClass('moved');
			} else {
				$label.removeClass('moved');
			}
		}

		function checkInputs() {
			var $autofills;
			$el.find('label + input').each(function() {
				moveLabel($(this));
			});
			try {
				$autofills = $(':-webkit-autofill')
			} catch(err) {
				$autofills = []
			}
			if ( $autofills.length ) {
				$autofills.each(function() {
					moveLabel($(this), true)
				});
			}
			// Needs to keep checking because autofill doesn't emit an event
			ticker = requestAnimationFrame(checkInputs);
		}

		checkInputs();

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			if ( ticker != null ) {
				cancelAnimationFrame(ticker);
			}
		});


	}
}
