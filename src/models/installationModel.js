import ko from 'knockout';
import moment from 'moment';
import * as mapping from 'knockout-mapping';
import HomeModel from './models/homeModel';
import WeddingPartyModel from './models/weddingPartyModel';
import MapModel from './models/mapModel';

const installationMapping = {
	'weddingParty': {
		create: (options) => {
			return new WeddingPartyModel(options.data)
		}
	},
	'locations': {
		create: (options) => {
			return new MapModel(options.data)
		}
	}
}

class InstallationModel {
	constructor(data) {
		this.UpdateData(data);
		this.activeSections = ko.pureComputed(this.generateLinks, this);
	}

	UpdateData(data) {
		mapping.fromJS(data, installationMapping, this);
	}

	generateLinks() {
		var activeSections = [];
		var sections = this.sections;
		for ( var section in sections ) {
			if ( sections.hasOwnProperty(section) && this.sections[section] != null && this.sections[section].isVisible() ) {
				activeSections.push({
					title: ko.unwrap(this.sections[section].menuText),
					idx: ko.unwrap(this.sections[section].displayIndex)
				});
			}
		}
		return activeSections.sort((a,b) => a.idx - b.idx).map((section) => section.title)
	}
}

export default InstallationModel;

