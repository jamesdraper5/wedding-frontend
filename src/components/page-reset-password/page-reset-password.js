import ko from 'knockout';
import templateMarkup from 'text!./page-reset-password.html';

class PageResetPassword {
	constructor(params) {
		this.newPassword = ko.observable('');
		this.confirmation = ko.observable('');
		this.isValidToken = ko.observable(false);
		this.isCheckingToken = ko.observable(true);
		this.isSubmitting = ko.observable(false);
		this.token = app.currentRoute().token || '';

		this.checkToken()
	}

	checkToken() {
		app.api.get(`/api/authenticate/checkresettoken/${this.token}`, {}, {errorCodesToIgnore: [404]}).then((result) => {
			this.isValidToken(true)
		}).catch((err) => {
			this.isValidToken(false)
			app.flash.Error( "<strong>Oh dear...</strong>", "This password reset token is invalid or has expired." );
			setTimeout(() => {
				app.GoTo("/forgotpassword")
			}, 3000)
		}).finally(() => {
			this.isCheckingToken(false)
		})

	}

	OnSubmit() {

		if ( this.newPassword() !== this.confirmation() ) {
			app.flash.Error( "<strong>Oops!</strong>", "Please ensure that you type the same password twice" );
			return;
		}
		if ( this.newPassword() === '' ) {
			app.flash.Error( "<strong>Yikes!</strong>", "Please enter your password" );
			return;
		}

		var data = {
			token: this.token,
			password: this.newPassword()
		}

		this.isSubmitting(true);

		app.api.post('/api/authenticate/resetpassword', data).then((result) => {
			app.flash.Success("Password updated", "Please login with your new password");
			this.newPassword('');
			this.confirmation('');
			setTimeout(() => {
				app.GoTo('/login')
			}, 2000);
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: PageResetPassword, template: templateMarkup };
