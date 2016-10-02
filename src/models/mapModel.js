import ko from 'knockout';
import * as mapping from 'knockout-mapping';

class MapModel {
    constructor(data) {
        mapping.fromJS(data, {}, this);

        this.address = ko.observable('') // used for geocoding address string to map co-ords
        this.isNew = data.isNew || false; // check whether this map is newly created, needed for adding new location to mapSections API
    }

    updateGoogleMapLocation() {
    	ko.postbox.publish('update-gmap-location', { id: this.id(), address: this.address() });

    }
}

export default MapModel;
