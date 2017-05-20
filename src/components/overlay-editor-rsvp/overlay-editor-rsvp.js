import ko from 'knockout';
import templateMarkup from 'text!./overlay-editor-rsvp.html';

class OverlayEditRsvp {
   	constructor(params) {
   		var data = app.installation.sections.rsvp;

		this.id = ko.unwrap(data.id);
		this.title = ko.observable( ko.unwrap(data.title) );
		this.text = ko.observable( ko.unwrap(data.text) );
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
			    this.title() !== ko.unwrap(data.title) ||
				this.text() !== ko.unwrap(data.text) ||
				this.menuText() !== ko.unwrap(data. menuText) ||
				this.isVisible() !== ko.unwrap(data.isVisible)
			) {
				return true;
			}
			return false;
		});

        this.sectionId = ko.pureComputed(() => {
			return app.getContainerId(this.menuText);
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
		var rsvpData = {
			title: this.title(),
			text: this.text(),
			menuText: this.menuText(),
			isVisible: this.isVisible()
		};
		app.api.put(`/api/rsvps/${this.id}`, rsvpData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
            $.scrollTo( $(this.sectionId()), 1000, { offset: -$('#main-nav').height() } );
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
		app.GoTo('/editor');
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}

}

export default { viewModel: OverlayEditRsvp, template: templateMarkup };
