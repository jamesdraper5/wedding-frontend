import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import moment from 'moment';

const homeMapping = {
	'weddingDate': {
		create: (options) => {
			return moment(options.data);
		}
	}
}

class HomeModel {
    constructor(data) {
    	console.log('data', data);
        mapping.fromJS(data, homeMapping, this);
    }

}

export default HomeModel;
