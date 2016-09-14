import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-maps.html';
//import * as GoogleMapsLoader from 'google-maps';

class OverlayEditMaps {
	constructor(params) {
		this.title = app.installation.sections.maps.menuText;
		this.maps = app.installation.sections.maps.locations;

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save';
			}
		});



		//GoogleMapsLoader.KEY = 'AIzaSyBdlmh7fqtInzVycyxMmzS4n9rAvZSlZYI';
	}



	OnSubmit() {
		this.isSubmitting(true);
		var introData = {
			header: this.title(),
			content: this.content(),
			menuText: this.menuText()
		};
		app.api.put(`api/intros/${this.id}`, introData).then((result) => {
			this.Close();
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	Close() {
		app.overlayToShow(null);
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayEditMaps, template: templateMarkup };
