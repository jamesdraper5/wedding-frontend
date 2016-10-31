import ko from 'knockout';
import templateMarkup from 'text!./admin-panel.html';
import * as mapping from 'knockout-mapping';

class AdminPanel {
	constructor(params) {
		this.message = ko.observable('Hello from the admin-panel component!');
	}

	OnClickEditIntro() {
		app.showOverlay({
			name: 'edit-intro',
			params: {}
		});
	}

	OnClickEditWeddingParty() {
		app.showOverlay({
			name: 'edit-wedding-party',
			params: {}
		});
	}

	OnClickEditLocations() {
		app.showOverlay({
			name: 'edit-maps',
			params: {}
		});
	}

	OnClickEditRsvp() {
		app.showOverlay({
			name: 'edit-rsvp',
			params: {}
		});
	}

	OnClickLogOut() {
    	app.Logout();
    }

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: AdminPanel, template: templateMarkup };
