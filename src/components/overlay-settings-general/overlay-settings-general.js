import ko from 'knockout';
import templateMarkup from 'text!./overlay-settings-general.html';
import overlayBaseModel from '../../models/overlayBaseModel';

class OverlaySettingsGeneral extends overlayBaseModel {
   	constructor(params) {
   		super();

   		this.accountUrl = ko.observable('');
		this.siteTitle = ko.observable('');
		this.faviconUrl = ko.observable('');
		this.themeId = ko.observable(1);

		this.isDirty = ko.pureComputed(() => {
			if (
			    1 === 1
			) {
				return true;
			}
			return false;
		});

	}

	OnSubmit() {
		this.isSubmitting(true);
		var data = {
			title: 'test'
		};
		app.api.put('/api/settings/general', data).then((result) => {
			app.flash.Success('Updated baby!');
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

export default { viewModel: OverlaySettingsGeneral, template: templateMarkup };
