import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-weddingparty.html';
import * as GroupModel from '../../models/weddingPartyGroupModel';
import * as PersonModel from '../../models/weddingPartyPersonModel';

class OverlayEditWeddingParty {
	constructor(params) {

		this.id = ko.unwrap(app.installation.sections.intro.id);
		this.title = ko.observable( ko.unwrap(app.installation.sections.intro.title) );
		this.content = ko.observable( ko.unwrap(app.installation.sections.intro.text) );
		this.menuText = ko.observable( ko.unwrap(app.installation.sections.intro.menuText) );
		this.groups = ko.observableArray(ko.unwrap(app.installation.sections.weddingParty.groups));

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save';
			}
		});

	}

	OnRendered() {
		var bodyHeight = $(window).height(),
			footerHeight = $('.overlay-footer').outerHeight(),
			overlayHeight = bodyHeight - footerHeight;

		$('#overlay-main').height(overlayHeight + 'px');
	}

	OnSubmit() {
		this.isSubmitting(true);

		var partyData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText()
		};

		partyData.groups = this.getGroupFormData(this.groups);

		app.api.put(`api/weddingParties/${this.id}`, partyData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Close() {
		app.hideOverlay();
		app.GoTo('editor')
	}

	AddPerson(group) {

		var newPerson = new PersonModel({
			id: Date.now(),
			name: "New Person",
            text: "",
            imageUrl: null
		});
		group.people.push(newPerson);

	}

	// remove unnecessary params before submitting form
	getGroupFormData(groups) {

		var groupsObj = ko.toJS(groups);

		for ( var group of groupsObj ) {

			delete group.__ko_mapping__
			delete group.isDirty

			for ( var person of group.people ) {
				delete person.isDirty;
				delete person.isEditing;
				delete person.__ko_mapping__;
			}
		}

		return groupsObj;
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayEditWeddingParty, template: templateMarkup };