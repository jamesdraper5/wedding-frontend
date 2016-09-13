import ko from 'knockout';
import templateMarkup from 'text!./admin-panel.html';
import * as mapping from 'knockout-mapping';

class AdminPanel {
	constructor(params) {
		this.message = ko.observable('Hello from the admin-panel component!');
	}

	OnClickEditIntro() {
		console.log('app.installation.sections.intro', app.installation.sections.intro);
		var introData = {
			id: ko.unwrap(app.installation.sections.intro.id),
			title: ko.unwrap(app.installation.sections.intro.header),
			content: ko.unwrap(app.installation.sections.intro.content),
			menuText: ko.unwrap(app.installation.sections.intro.menuText)
		}
		//app.modal.Show('edit-intro', introData, this);

		app.overlayToShow({
			name: 'edit-intro',
			params: introData
		});
	}

	OnClickEditWeddingParty() {
		console.log('app.installation.sections.weddingParty', app.installation.sections.weddingParty);
		var weddingPartyData = {
			id: ko.unwrap(app.installation.sections.weddingParty.id),
			title: ko.unwrap(app.installation.sections.weddingParty.title),
			content: ko.unwrap(app.installation.sections.weddingParty.text),
			groups: app.installation.sections.weddingParty.groups,
			menuText: ko.unwrap(app.installation.sections.weddingParty.menuText)
		}

		app.overlayToShow({
			name: 'edit-wedding-party',
			params: weddingPartyData
		});
	}

	OnClickEditLocations() {
		console.log('app.installation.sections.maps', app.installation.sections.maps);
	}

	OnClickEditRsvp() {
		console.log('app.installation.sections.rsvp', app.installation.sections.rsvp);
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: AdminPanel, template: templateMarkup };
