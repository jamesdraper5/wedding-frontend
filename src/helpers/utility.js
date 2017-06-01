import ko from 'knockout';
import 'jquery';

class Utility {
	constructor(data) {

	}

	FindIndexByKeyValue (arr, key, value, looseType=false) {
		var i = 0;
		var numeric = false;
		if ( looseType ) { numeric = !isNaN(value) }
		if ( numeric ) {
			while ( i < arr.length ) {
				if ( parseInt(ko.unwrap(arr[i][key]), 10) === parseInt(value, 10) ) {
					return i
				}
				i++
			}
		} else {
			while ( i < arr.length ) {
				if ( ko.unwrap(arr[i][key]) === value ) {
					return i
				}
				i++
			}
		}
		return -1
	}

	DoesFormHaveChanges() {
		return $('.hasChanges').not('.ignore').length > 0;
	}

	IgnoreFormChanges() {
		$('.hasChanges').addClass('ignore');
	}

	FormatLink(url) {
		if ( url == null || /^mailto:/i.test(url) ) {
			return url;
		}
		if (!/^https?:\/\//i.test(url)) {
		    url = 'http://' + url;
		}
		return url;
	}
}

export default Utility;
