import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.botChecker = {

	init: (element, valueAccessor) => {

		var subscriptions = [];
		var $el = $(element);
		var userIsHuman = valueAccessor();

		userIsHuman(false); // Always set value to fals initially until we can be sure it's not a bot

		// listen for mousemove or touch events that prove user is not a bot
		function listenForHumans() {
		    $el.on('mousemove.botChecker touchstart.botChecker', detectHuman);
		    $el.find('input, textarea').on('keyup.botChecker keypress.botChecker', detectHuman);
		}

		function detectHuman() {
			userIsHuman(true);
			removeListeners();
		}

		function removeListeners() {
			$el.off('mousemove.botChecker touchstart.botChecker');
		    $el.find('input, textarea').off('keyup.botChecker keypress.botChecker');
		}

		listenForHumans();

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			removeListeners()
		});


	}
}
