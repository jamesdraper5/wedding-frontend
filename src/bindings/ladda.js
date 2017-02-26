import ko from 'knockout';
import * as Ladda from 'ladda';
import $ from 'jquery';

ko.bindingHandlers.ladda = {

	init: (element, valueAccessor) => {

		var subscriptions = []
		var l = Ladda.create(element)
		subscriptions.push( ko.computed({
			read: () => {
				var isVisible = ko.unwrap(valueAccessor())
				$(element).find('.ladda-spinner').toggle();
				if ( isVisible ) {
					l.start();
				} else {
					l.stop();
				}
			},
			disposeWhenNodeIsRemoved: element
		}));

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			subscriptions.forEach((subscription) => {
				subscription.dispose();
			});
		});

	}
}
