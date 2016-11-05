import ko from 'knockout';
import templateMarkup from 'text!./page-forgot-password.html';

class PageForgotPassword {
	constructor(params) {
		this.userEmail = ko.observable('');
		this.isSubmitting = ko.observable(false);
		this.isLoggingOut = ko.observable(false);
	}


	OnSubmit() {
		var data = {
			email: this.userEmail()
		}
		this.isSubmitting(true);

		app.api.post('api/authenticate/recoverpassword', data, {errorCodesToIgnore: [404]}).then((result) => {
			app.flash.Success(`An email has been sent to ${this.userEmail()} with further instructions`);
		}).catch((result) => {
			console.log('result', result);
			if ( result.status === 404 ) {
				app.flash.Error( "<strong>Oops!</strong> ", "No account with that email was found." );
			}
		}).finally(() => {
			this.userEmail('');
			this.isSubmitting(false);
		});
	}

	OnClickLogOut() {
		this.isLoggingOut(true);
		app.Logout().then(() => {
			this.isLoggingOut(false);
		})
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: PageForgotPassword, template: templateMarkup };
