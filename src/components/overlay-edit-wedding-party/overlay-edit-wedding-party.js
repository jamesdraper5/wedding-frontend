import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-wedding-party.html';
import * as GroupModel from '../../models/weddingPartyGroupModel';
import * as PersonModel from '../../models/weddingPartyPersonModel';

class OverlayEditWeddingParty {
	constructor(params) {

		this.id = params.id;
		this.title = ko.observable( params.title );
		this.content = ko.observable( params.content );
		this.menuText = ko.observable( params.menuText );
		this.groups = ko.observableArray(ko.unwrap(params.groups));

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
		var overlayOffset = $('#page-holder').offset().left,
			bodyHeight = $(window).height(),
			navHeight = $('#navbar').outerHeight(),
			footerHeight = $('.overlay-footer').outerHeight(),
			overlayHeight = bodyHeight - (navHeight + footerHeight);

		$('.overlay-footer').css({left: overlayOffset+'px'});
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
		app.closeOverlay();
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
