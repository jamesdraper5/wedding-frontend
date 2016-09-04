import ko from 'knockout';

ko.extenders.trackChanges = function (target, track) {
	if (track) {
		target.isDirty = ko.observable(false);
		target.originalValue = target();
		target.setOriginalValue = function(startingValue) {
			target.originalValue = startingValue;
		};
		target.subscribe(function (newValue) {
			// use != not !== so numbers will equate naturally
			target.isDirty(newValue != target.originalValue);
		});
	}
	return target;
};
