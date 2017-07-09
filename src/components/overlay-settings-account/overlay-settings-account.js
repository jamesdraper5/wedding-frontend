import ko from 'knockout';
import templateMarkup from 'text!./overlay-settings-account.html';
import overlayBaseModel from '../../models/overlayBaseModel';
import PartnerModel from '../../models/partnerModel';

class OverlaySettingsAccount extends overlayBaseModel {
   	constructor(params) {
   		super();

   		this.email = ko.observable('');
		this.partnerOne = ko.observable(null);
		this.partnerTwo = ko.observable(null);

		this.isDirty = ko.pureComputed(() => {
			if (
			    false
			) {
				return true;
			}
			return false;
		});

		this.loadData();
	}

	loadData() {
		app.api.get('api/settings/account').then((result) => {

			let data = result.response.data;
			let partners =  data.partners;

			this.email(data.emailAddress);
			this.partnerOne( new PartnerModel( partners[0] ) );
			this.partnerTwo( new PartnerModel( partners[1] ) );

		})
	}


	OnClickChangePassword() {
		app.modal.Show("change-password");
	}

	OnSubmit() {
		this.isSubmitting(true);

		var partners = [ this.partnerOne(), this.partnerTwo() ].map((partner) => {
			return {
				id: partner.id(),
				firstName: partner.firstName(),
				lastName: partner.lastName()
			}
		});

		var data = {
			email: this.email(),
			partners: partners
		};

		app.api.put('/api/settings/account', data).then((result) => {
			app.flash.Success('Settings updated');
			app.updateInstallationData();
			this.Close();

		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Cancel() {
		var self = this;
		var close = function() {
			self.Close(true);
		}

		if ( this.isDirty() ) {
			app.modal.Confirm('You have unsaved changes', 'Are you sure you want to discard these changes?', close);
		} else {
			close();
		}

	}

	Close(reset=false) {
		if ( reset ) {
			app.utility.IgnoreFormChanges();
		}
		app.hideOverlay();
		app.GoTo('/settings');
	}

}

export default { viewModel: OverlaySettingsAccount, template: templateMarkup };
