import ko from 'knockout';
import templateMarkup from 'text!./section-travel.html';

class TravelSection {
	constructor(params) {
		//this.rsvp = app.installation.sections.rsvp;
		this.containerId = 'travel'; //this.rsvp.menuText().toLowerCase().split(' ').join('-') + '-container';



	}



	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: TravelSection, template: templateMarkup };
