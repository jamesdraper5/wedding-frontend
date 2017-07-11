import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import moment from 'moment';

const nonTrackableKeys = ['isEditing'];
const mapMapping = {
	'startTime': {
		create: (options) => {
			return ko.observable(moment.utc(options.data));
		},
		update: (options) => {
			return moment.utc(options.data);
		}
	}
}

class MapModel {
    constructor(data) {
		data.isEditing = !!data.isEditing; // if it's undefined then cooerce it to false
        mapping.fromJS(data, mapMapping, this);

        this.isNew = data.isNew || false; // check whether this map is newly created, needed for adding new location to mapSections API

		this.formattedStartTime = ko.pureComputed(() => {
			if ( moment.isMoment(this.startTime()) && this.startTime().isValid() ) {
				return this.startTime().format('dddd, MMMM Do YYYY - h:mmA');
			}
			return '';
		});

        this.trackAllChanges();

        this.isDirty = ko.computed(() => {
            for (var key in this) {
                if (this.hasOwnProperty(key) && ko.isObservable(this[key]) && typeof this[key].isDirty === 'function' && this[key].isDirty() && nonTrackableKeys.indexOf(key) === -1) {
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

	ToggleEdit() {
		this.isEditing( !this.isEditing() );
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
