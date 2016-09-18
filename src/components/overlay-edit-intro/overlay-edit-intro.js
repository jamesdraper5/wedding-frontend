import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-intro.html';

class OverlayWelcomeMessage {
	constructor(params) {

		this.id = params.id;
		this.title = ko.observable( params.title );
		this.content = ko.observable( params.content );
		this.menuText = ko.observable( params.menuText );

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
		var introData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText()
		};
		app.api.put(`api/intros/${this.id}`, introData).then((result) => {
			app.flash.Success('Updated baby!');
			this.Close();
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Close() {
		app.closeOverlay();
		console.log('close');
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayWelcomeMessage, template: templateMarkup };
