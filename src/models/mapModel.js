import ko from 'knockout';
import * as mapping from 'knockout-mapping';

class MapModel {
    constructor(data) {
        mapping.fromJS(data, {}, this);
    }

}

export default MapModel;