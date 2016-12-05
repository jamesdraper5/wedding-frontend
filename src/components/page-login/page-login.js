import ko from 'knockout';
import templateMarkup from 'text!./page-login.html';

class PageLogin {
	constructor(params) {
		this.userEmail = ko.observable('');
		this.userPassword = ko.observable('');
		this.stayLoggedIn = ko.observable(false);
		this.isSubmitting = ko.observable(false);
		this.isLoggingOut = ko.observable(false);
	}

	OnSubmitLogin() {
		var data = {
			email: this.userEmail(),
			password: this.userPassword(),
			stayLoggedIn: this.stayLoggedIn()
		}
		this.isSubmitting(true);

		// Just to be safe:
		if ( app.loggedInUser != null ) {
			app.loggedInUser = null
		}

		app.api.post('api/authenticate', data).then((result) => {
			app.getLoggedInUser().then((result) => {
				app.flash.Success(`Welcome back ${app.loggedInUser.firstName()}!`);
				// app.cache.set "lastGoodUsername", @userName() TO DO: nice touch
				if ( app.requestedRouteBeforeLoginRedirect != null ) {
					app.GoTo( app.requestedRouteBeforeLoginRedirect.path )
					app.requestedRouteBeforeLoginRedirect = undefined
				} else {
					app.GoTo( '/editor' )
				}

			})
		}).catch((result) => {
			if ( result.status && result.status === 401 ) {
				app.flash.Error( "<strong>Ooops!</strong>", "Login failed. Incorrect email or password" );
			}
		}).finally(() => {
			this.userPassword('');
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

export default { viewModel: PageLogin, template: templateMarkup };
