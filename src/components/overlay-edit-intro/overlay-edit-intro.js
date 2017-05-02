import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-intro.html';

class OverlayWelcomeMessage {
	constructor(params) {
		var data = app.installation.sections.intro;

		this.id = ko.unwrap(data.id);
		this.title = ko.observable( ko.unwrap(data.header) );
		this.content = ko.observable( ko.unwrap(data.content) );
		this.menuText = ko.observable( ko.unwrap(data.menuText) );
		this.isVisible = ko.observable( ko.unwrap(data.isVisible) );

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save My Changes';
			}
		});

		this.isDirty = ko.pureComputed(() => {
			if (
			    this.title() !== ko.unwrap(data.header) ||
				this.content() !== ko.unwrap(data.content) ||
				this.menuText() !== ko.unwrap(data.menuText) ||
				this.isVisible() !== ko.unwrap(data.isVisible)
			) {
				return true;
			}
			return false;
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
		var introData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText(),
			isVisible: this.isVisible()
		};
		app.api.put(`/api/intros/${this.id}`, introData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
			$.scrollTo( $('#home-container'), 1000, { offset: -$('#main-nav').height() } )
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	//

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
			app.utility.IgnoreFormChanges();
		}
		app.hideOverlay();
		app.GoTo('/editor');
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayWelcomeMessage, template: templateMarkup };
