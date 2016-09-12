import ko from 'knockout';

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
}

export default Utility;
