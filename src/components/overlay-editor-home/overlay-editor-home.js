import ko from 'knockout';
import moment from 'moment';
import templateMarkup from 'text!./overlay-editor-home.html';

class OverlayHomeSection {
	constructor(params) {
		var data = app.installation.sections.home;
		console.log('data', data);
		this.id = ko.unwrap(data.id);
		this.name = ko.observable( this.generateDefaultTitle(data.partnerNames()) ); // generate a title such as "Mary & John" for the default title
		this.hasCustomName = ko.observable( ko.unwrap(data.hasCustomName) );
		this.customName = ko.observable( ko.unwrap(data.customName) ); // This is the title of the site in the installations table
		this.weddingDate = ko.observable( ko.unwrap(data.weddingDate) );
		this.mainImage = ko.observable( ko.unwrap(data.mainImage) );
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
			    this.name() !== ko.unwrap(data.name) ||
				this.weddingDate() !== ko.unwrap(data.weddingDate) ||
				this.mainImage() !== ko.unwrap(data.mainImage) ||
				this.menuText() !== ko.unwrap(data. menuText) ||
				this.isVisible() !== ko.unwrap(data.isVisible)
			) {
				return true;
			}
			return false;
		});

	}

	generateDefaultTitle(names) {
		console.log('names', names);
		if ( names.length !== 2 ) {
			return 'Our Wedding';
		}
		return `${names[0]} & ${names[1]}`;
	}

	OnRendered() {
		var bodyHeight = $(window).height(),
			footerHeight = $('.overlay-footer').outerHeight(),
			overlayHeight = bodyHeight - footerHeight;

		$('.overlay-main').height(overlayHeight + 'px');
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

export default { viewModel: OverlayHomeSection, template: templateMarkup };
