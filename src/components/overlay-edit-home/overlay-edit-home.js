import ko from 'knockout';
import moment from 'moment';
import templateMarkup from 'text!./overlay-edit-home.html';

class OverlayHomeSection {
	constructor(params) {

		this.id = ko.unwrap(app.installation.sections.home.id);
		this.name = ko.observable( ko.unwrap(app.installation.sections.home.name) );
		this.weddingDate = ko.observable( ko.unwrap(app.installation.sections.home.weddingDate) );
		this.mainImage = ko.observable( ko.unwrap(app.installation.sections.home.mainImage) );
		this.menuText = ko.observable( ko.unwrap(app.installation.sections.home.menuText) );
		this.isVisible = ko.observable( ko.unwrap(app.installation.sections.home.isVisible) );

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save My Changes';
			}
		});

	}

	OnRendered() {
		var bodyHeight = $(window).height(),
			footerHeight = $('.overlay-footer').outerHeight(),
			overlayHeight = bodyHeight - footerHeight;

		$('#overlay-main').height(overlayHeight + 'px');
	}

	OnClickEditImage() {
		app.modal.Show("upload-image", { imageUrl: this.mainImage });
	}

	OnSubmit() {
		this.isSubmitting(true);
		var homeData = {
			name: this.name(),
			weddingDate: this.weddingDate().format('YYYY-MM-DD'),
			mainImage: this.mainImage(),
			menuText: this.menuText(),
			isVisible: this.isVisible()
		};
		app.api.put(`/api/homeSections/${this.id}`, homeData).then((result) => {
			app.flash.Success("Yep, that's all updated now");
			app.updateInstallationData();
			this.Close();
			$.scrollTo( $('#home-container'), 1000, { offset: -$('#main-nav').height() } )
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Close() {
		app.hideOverlay();
		app.GoTo('/editor')
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayHomeSection, template: templateMarkup };
