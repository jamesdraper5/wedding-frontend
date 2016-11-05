import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-intro.html';

class OverlayWelcomeMessage {
	constructor(params) {

		this.id = ko.unwrap(app.installation.sections.intro.id);
		this.title = ko.observable( ko.unwrap(app.installation.sections.intro.header) );
		this.content = ko.observable( ko.unwrap(app.installation.sections.intro.content) );
		this.menuText = ko.observable( ko.unwrap(app.installation.sections.intro.menuText) );

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
		var introData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText()
		};
		app.api.put(`api/intros/${this.id}`, introData).then((result) => {
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

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayWelcomeMessage, template: templateMarkup };
