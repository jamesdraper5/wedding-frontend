import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import MapModel from './mapModel';


class MapGroupModel {
	constructor(data) {
		this.originalData = data;
		this.UpdateData(data);
		this.subscriptions = [];

		this.trackAllChanges();
		this.isDirty = ko.computed(() => {
		    for (var key in this) {
		        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) && typeof this[key].isDirty === 'function' && this[key].isDirty()) {
		            return true;
		        } else if ( key === 'locations' ) {
		        	for ( var map of this[key]() ) {
	        			if ( map.isDirty() ) {
	        				return true;
	        			}
	        		}
		        }
		    }
		    return false;
		});


		// The mapModel sends this event to let us know that one of the maps in the array has had their details updated.
		// We can then use this to trigger the isDirty computed to update
		ko.postbox.subscribe('map-changed',  () => {
			this.locations.valueHasMutated();
		});

		this.navTitle = ko.pureComputed(() => {
			return this.title().split(" ")[0] + Date.now();
		});


	}

	UpdateData(data) {
		mapping.fromJS(data, MapGroupModel.mapping, this);
	}

	ResetData() {
		this.UpdateData(this.originalData);
	}

	trackAllChanges() {
	    for (var key in this) {
	        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) ) {
		        if ( key !== 'locations' ) {
		        	this[key].extend({ trackChanges: true });
		        }
		    }
	    }
	}
}

MapGroupModel.mapping = {
	'locations': {
        create: (options) => {
			return new MapModel(options.data)
        }
    }
}


export default MapGroupModel;
