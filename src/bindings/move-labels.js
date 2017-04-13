import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.moveLabels = {

	init: (element, valueAccessor) => {

		var subscriptions = [];
		var $el = $(element);

		// Forms where the labels move up when you type
		function moveLabel(field,force) {
			var val = field.val().length;
			var label = field.siblings('label');
			if ( !label.length ) {
				return;
			}
			if ( val || force ) {
				label.addClass('moved');
			} else {
				label.removeClass('moved');
			}
		}

		// Chrome autofill yellow fix
		function autofillFix() {
			var autofills;
			$el.find('label + input').each(function() {
				moveLabel($(this));
			});
			try {
				autofills = $(':-webkit-autofill')
			} catch(err) {
				autofills = []
			}
			if ( autofills.length ) {
				autofills.each(function() {
					moveLabel($(this), true)
				});
			}
			requestAnimationFrame(autofillFix);
		}


		autofillFix();

		$el.find('label + input').on('change keypress', function() {
			moveLabel($(this)); // TO DO: can we just call moveLabel directly and then remove it on disposal (e.g. $el.off('change', moveLabel))
		});

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			subscriptions.forEach((subscription) => {
				subscription.dispose();
			});
		});


	}
}
