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

		app.api.post('/api/authenticate', data).then(() => {
			app.logIn(true)
			.then(() => {
				app.flash.Success(`Welcome back ${app.loggedInUser.firstName()}!`);
				// app.cache.set "lastGoodUsername", @userName() TO DO: nice touch
				if ( app.requestedRouteBeforeLoginRedirect != null ) {
					app.GoTo( app.requestedRouteBeforeLoginRedirect.path )
					app.requestedRouteBeforeLoginRedirect = undefined
				} else {
					app.GoTo( '/editor' )
				}
			})
			.catch(this.handleError);
		})
		.catch(this.handleError)
		.finally((res) => {
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

	handleError(result) {
		if ( result.status && result.status === 401 ) {
			app.flash.Error( "<strong>Ooops!</strong>", "Login failed. Incorrect email or password" );
		} else if ( result.status && result.status === 403 ) {
			app.flash.Error( "<strong>Hmmm</strong>", "Login failed. Please try again" );
		} else {
			app.flash.Error( "<strong>Oh No!</strong>", "We're having trouble logging you in at the moment. Try again in a little while" );
		}
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: PageLogin, template: templateMarkup };
