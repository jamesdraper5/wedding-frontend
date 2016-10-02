import ko from 'knockout';
import templateMarkup from 'text!./admin-panel.html';
import * as mapping from 'knockout-mapping';

class AdminPanel {
	constructor(params) {
		this.message = ko.observable('Hello from the admin-panel component!');
	}

	OnClickEditIntro() {
		var introData = {
			id: ko.unwrap(app.installation.sections.intro.id),
			title: ko.unwrap(app.installation.sections.intro.header),
			content: ko.unwrap(app.installation.sections.intro.content),
			menuText: ko.unwrap(app.installation.sections.intro.menuText)
		}

		app.showOverlay({
			name: 'edit-intro',
			params: introData
		});
	}

	OnClickEditWeddingParty() {
		var weddingPartyData = {
			id: ko.unwrap(app.installation.sections.weddingParty.id),
			title: ko.unwrap(app.installation.sections.weddingParty.title),
			content: ko.unwrap(app.installation.sections.weddingParty.text),
			groups: app.installation.sections.weddingParty.groups,
			menuText: ko.unwrap(app.installation.sections.weddingParty.menuText)
		}

		app.showOverlay({
			name: 'edit-wedding-party',
			params: weddingPartyData
		});
	}

	OnClickEditLocations() {
		app.showOverlay({
			name: 'edit-maps',
			params: {}
		});
	}

	OnClickEditRsvp() {
		console.log('app.installation.sections.rsvp', app.installation.sections.rsvp);
		app.showOverlay({
			name: 'edit-rsvp',
			params: {}
		});
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: AdminPanel, template: templateMarkup };
