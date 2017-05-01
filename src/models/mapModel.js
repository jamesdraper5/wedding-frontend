import ko from 'knockout';
import * as mapping from 'knockout-mapping';

class MapModel {
    constructor(data) {
        mapping.fromJS(data, {}, this);

        this.address = ko.observable('') // used for geocoding address string to map co-ords
        this.isNew = data.isNew || false; // check whether this map is newly created, needed for adding new location to mapSections API

        this.trackAllChanges();

        this.isDirty = ko.computed(() => {
            for (var key in this) {
                if (this.hasOwnProperty(key) && ko.isObservable(this[key]) && typeof this[key].isDirty === 'function' && this[key].isDirty()) {
                    return true;
                }
            }
            return false;
        });

        this.isDirty.subscribe((n) => {
        	ko.postbox.publish('map-changed',  {});
        });
    }

    updateGoogleMapLocation() {
    	ko.postbox.publish('update-gmap-location', { id: this.id(), address: this.address() });

    }

    trackAllChanges() {
	    for (var key in this) {
	        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) ) {
	            this[key].extend({ trackChanges: true });
	        }
	    }
	}

}

export default MapModel;
