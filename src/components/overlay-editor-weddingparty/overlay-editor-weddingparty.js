import ko from 'knockout';
import templateMarkup from 'text!./overlay-editor-weddingparty.html';
import GroupModel from '../../models/weddingPartyGroupModel';
import PersonModel from '../../models/weddingPartyPersonModel';

class OverlayEditWeddingParty {
	constructor(params) {
		var weddingParty = app.installation.sections.weddingParty;

		this.id = ko.unwrap(weddingParty.id);
		this.title = weddingParty.title;
		this.content = weddingParty.text;
		this.menuText = weddingParty.menuText;
		this.isVisible = weddingParty.isVisible;
		this.groups = ko.observableArray(ko.unwrap(weddingParty.groups));
		this.isDirty = weddingParty.isDirty;

		this.resetData = weddingParty.ResetData;

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save My Changes';
			}
		});
	}

	OnRendered() {
		var bodyHeight = $(window).height(),
			footerHeight = $('.overlay-footer').outerHeight(),
			overlayHeight = bodyHeight - footerHeight;

		$('.overlay-main').height(overlayHeight + 'px');
	}

	OnSubmit() {
		this.isSubmitting(true);

		var partyData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText(),
			isVisible: this.isVisible()
		};

		partyData.groups = this.getGroupFormData(this.groups);

		app.api.put(`/api/weddingParties/${this.id}`, partyData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
			$.scrollTo( $('#wedding-party-container'), 1000, { offset: -$('#main-nav').height() } )
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	OnClickEditImage(person) {
		app.modal.Show("upload-image", { imageUrl: person.imageUrl, editorOpts: { cropRatio: 1 } });
	}

	Cancel() {
		var self = this;
		var close = function() {
			self.Close(true);
		}

		if ( this.isDirty() ) {
			app.modal.Confirm('You have unsaved changes', 'Are you sure you want to discard these changes?.', close);
		} else {
			close();
		}

	}

	Close(reset=false) {
		if ( reset ) {
			app.installation.sections.weddingParty.ResetData();
		}
		app.hideOverlay();
		app.GoTo('/editor');
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
