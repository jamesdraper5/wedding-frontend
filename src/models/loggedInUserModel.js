import ko from 'knockout';
import moment from 'moment';
import * as mapping from 'knockout-mapping';

class LoggedInUserModel {
	constructor(data) {
		this.UpdateData(data);
	}

	UpdateData(data) {
		mapping.fromJS(data.user, {}, this);
	}
}

export default LoggedInUserModel;
