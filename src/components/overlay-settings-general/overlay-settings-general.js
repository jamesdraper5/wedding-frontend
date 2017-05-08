import ko from 'knockout';
import templateMarkup from 'text!./overlay-settings-general.html';
import overlayBaseModel from '../../models/overlayBaseModel';

class OverlaySettingsGeneral extends overlayBaseModel {
   	constructor(params) {
   		super();

   		this.originalSubdomain = ko.unwrap(app.installation.url).split('.')[0];
   		this.baseUrl = ( window.devMode ? 'wedding.dev' : 'weddingpixie.com' );

   		this.accountUrl = ko.observable(this.originalSubdomain).extend({ rateLimit: 300 });
		this.selectedThemeId = ko.observable( ko.unwrap(app.installation.theme.id) );
		this.availableThemes = ko.observableArray([]);
		this.isUrlAvailable = ko.observable(true);

		this.isDirty = ko.pureComputed(() => {
			if (
			    this.selectedThemeId() !== app.installation.theme.id() ||
			    this.accountUrl() !== this.originalSubdomain
			) {
				return true;
			}
			return false;
		});

		this.areThemesLoaded = ko.observable(false);
		this.subscriptions.push(this.accountUrl.subscribe((url) => {
			this.checkUrl(url);
		}));

		this.loadThemes();

	}

	loadThemes() {
		app.api.get('api/settings/themes').then((result) => {
			this.availableThemes(result.response.data.themes);
			this.areThemesLoaded(true);
		});
	}

	checkUrl(url) {
		if ( url.length === 0 ) {
			this.isUrlAvailable(true);
			return;
		}
		app.api.get(`api/installations/checkurl?url=${url}`).then((result) => {
			this.isUrlAvailable(true);
		}).catch((err) => {
			this.isUrlAvailable(false);
		})
	}

	OnClickPreviewTheme() {
		console.log('TODO - OnClickPreviewTheme');
	}

	OnSubmit() {
		this.isSubmitting(true);
		var fullUrl = `${this.accountUrl()}.${this.baseUrl}`;
		var data = {
			url: fullUrl,
			themeId: this.selectedThemeId()
		};
		app.api.put('/api/settings/general', data).then((result) => {
			app.flash.Success('Settings updated');
			if ( this.accountUrl() !== this.originalSubdomain ) {
				window.location.href = 'http://' + result.response.data.url + '/settings';
			} else {
				app.updateInstallationData();
				this.Close();
			}
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
