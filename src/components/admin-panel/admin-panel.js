import ko from 'knockout';
import templateMarkup from 'text!./admin-panel.html';
import * as mapping from 'knockout-mapping';

class AdminPanel {
	constructor(params) {

	}

	OnClickLogOut() {
		app.Logout(true);
	}

	// Using app.GoTo means that it first checks for unsaved form changes before switching routes
	OnClickSection(data, event) {
		console.assert(event.target.pathname != null, 'Must pass a path to OnClickSection');
		if (event.target.pathname) {
			app.GoTo(event.target.pathname);
		}
		return false;
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: AdminPanel, template: templateMarkup };
