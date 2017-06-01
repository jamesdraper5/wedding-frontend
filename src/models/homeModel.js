import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import moment from 'moment';

const homeMapping = {
	'weddingDate': {
		create: (options) => {
			return ko.observable(moment(options.data));
		},
		update: (options) => {
			return moment(options.data);
		}
	}
}

class HomeModel {
    constructor(data) {
       	this.partnerOneName = ko.pureComputed(() => {
       		return this.partnerNames()[0];
       	});

       	this.partnerTwoName = ko.pureComputed(() => {
       		return this.partnerNames()[1];
       	});

		this.title = ko.pureComputed(() => {
       		return `${this.partnerOneName()} & ${this.partnerTwoName()}`;
       	});

       	this.weddingDateFormatted = ko.pureComputed(() => {
			return this.weddingDate().format(app.constants.DATEFORMATS.long);
		});

       	this.UpdateData(data);
    }

    UpdateData(data) {
        return mapping.fromJS(data, homeMapping, this);
    }

}

export default HomeModel;
