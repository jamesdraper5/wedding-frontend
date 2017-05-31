import ko from 'knockout';
import * as mapping from 'knockout-mapping';

const nonTrackableKeys = ['isEditing'];

class DirectionsModel {
    constructor(data) {
        data.isEditing = !!data.isEditing; // if it's undefined then cooerce it to false

        console.log('data', data);

        mapping.fromJS(data, {}, this);

        this.isNew = data.isNew || false; // check whether this model is newly created, needed for adding new direction to mapSections API

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
        	ko.postbox.publish('direction-changed',  {});
        });
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

export default DirectionsModel;
