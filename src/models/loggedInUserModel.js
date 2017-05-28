import ko from 'knockout';
import moment from 'moment';
import * as mapping from 'knockout-mapping';

class LoggedInUserModel {
	constructor(data) {
		this.UpdateData(data);
		this.initials = ko.pureComputed(() => {
			return `${this.firstName().charAt(0).toUpperCase()}${this.lastName().charAt(0).toUpperCase()}`
		});
	}

	UpdateData(data) {
		mapping.fromJS(data.user, {}, this);
	}
}

export default LoggedInUserModel;
