import ko from 'knockout';
import * as mapping from 'knockout-mapping';

class InstallationModel {
    constructor(data) {

        mapping.fromJS(data, {}, this);


    }

}

export default InstallationModel;