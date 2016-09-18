import ko from 'knockout';
import templateMarkup from 'text!./section-maps.html';

class MapsSection {
	constructor(params) {
		this.title = app.installation.sections.maps.menuText;
		this.maps = app.installation.sections.maps.locations;
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: MapsSection, template: templateMarkup };
