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
       	data.partnerOneName = data.partnerNames[0];
       	data.partnerTwoName = data.partnerNames[1];

        mapping.fromJS(data, homeMapping, this);

    }

}

export default HomeModel;
