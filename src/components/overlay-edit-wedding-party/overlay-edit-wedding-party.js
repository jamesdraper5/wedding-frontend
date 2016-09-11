import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-wedding-party.html';
import * as GroupModel from '../../models/weddingPartyGroupModel';

class OverlayEditWeddingParty {
	constructor(params) {

		this.id = params.id;
		this.title = ko.observable( params.title );
		this.content = ko.observable( params.content );
		this.menuText = ko.observable( params.menuText );
		this.groups = ko.observableArray([]);

		for ( var group of params.groups ) {
			this.groups.push( new GroupModel(group) );
		}

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save';
			}
		});

	}

	OnShow() {
		return;
	}

	OnSubmit() {


		this.isSubmitting(true);

		var partyData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText()
		};

		partyData.groups = this.getGroupFormData(this.groups);

		console.log('this.groups', partyData.groups);

		//return false;

		app.api.put(`api/weddingParties/${this.id}`, partyData).then((result) => {
			app.flash.Success('Updated baby!');
			this.Close();
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Close() {
		app.overlayToShow(null);
	}

	ShowAddForm() {
		alert('TO DO - showAddForm');
	}

	getGroupFormData(groups) {

		var groupsObj = ko.toJS(groups);

		for ( var group of groupsObj ) {
			console.log('group', group);

			delete group.__ko_mapping__
			delete group.isDirty

			for ( var person of group.people ) {
				delete person.isDirty;
				delete person.isEditing;
				delete person.__ko_mapping__;
			}
		}

		console.log('groupsObj', groupsObj);

		return groupsObj;
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayEditWeddingParty, template: templateMarkup };
