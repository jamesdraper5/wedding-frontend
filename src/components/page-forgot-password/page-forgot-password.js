import ko from 'knockout';
import templateMarkup from 'text!./page-forgot-password.html';

class PageForgotPassword {
	constructor(params) {
		this.userEmail = ko.observable('');
		this.isSubmitting = ko.observable(false);
	}


	OnSubmit() {
		var data = {
			email: this.userEmail()
		}
		this.isSubmitting(true);

		app.api.post('api/authenticate/recoverpassword', data).then((result) => {
			app.flash.Success(`An email has been sent to ${this.userEmail()} with further instructions`);
		}).catch((result) => {
			if ( result.response.message ) {
				app.flash.Error( "<strong>Oops!</strong> ", result.response.message );
			}
		}).finally(() => {
			this.userEmail('');
			this.isSubmitting(false);
		});
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: PageForgotPassword, template: templateMarkup };
