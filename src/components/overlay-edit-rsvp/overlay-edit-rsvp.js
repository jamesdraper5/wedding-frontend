import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-rsvp.html';

class OverlayEditRsvp {
   	constructor(params) {

		this.id = ko.unwrap(app.installation.sections.rsvp.id);
		this.title = ko.observable( ko.unwrap(app.installation.sections.rsvp.title) );
		this.text = ko.observable( ko.unwrap(app.installation.sections.rsvp.text) );
		this.menuText = ko.observable( ko.unwrap(app.installation.sections.rsvp.menuText) );
		this.isVisible = ko.observable( params.isVisible || false );


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
		var rsvpData = {
			title: this.title(),
			text: this.content(),
			menuText: this.menuText(),
			isVisible: this.isVisible()
		};
		app.api.put(`api/rsvps/${this.id}`, rsvpData).then((result) => {
			console.log('result', result);
			app.flash.Success('Updated baby!');
			this.Close();
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Close() {
		app.hideOverlay();
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}

}

export default { viewModel: OverlayEditRsvp, template: templateMarkup };
