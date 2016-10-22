import ko from 'knockout';
import templateMarkup from 'text!./page-login.html';

class PageLogin {
    constructor(params) {
    	this.userEmail = ko.observable('');
    	this.userPassword = ko.observable('');
    	this.isLoginSubmitting = ko.observable(false);
    }

    OnSubmitLogin() {
    	var data = {
    		email: this.userEmail(),
    		password: this.userPassword()
    	}
    	this.isLoginSubmitting(true);

    	// Just to be safe:
    	if ( app.loggedInUser != null ) {
    	    app.loggedInUser = null
    	}

    	app.api.post('api/authenticate', data).then((result) => {
    		app.getLoggedInUser().then((result) => {
	    		app.flash.Success(`Welcome back ${app.loggedInUser.firstName()}!`);
	    		// app.cache.set "lastGoodUsername", @userName() TO DO: nice touch
	    		if ( app.requestedRouteBeforeLoginRedirect != null ) {
	    		    app.GoTo( app.requestedRouteBeforeLoginRedirect.request_ )
	    		    app.requestedRouteBeforeLoginRedirect = undefined
	    		} else {
	    		    app.GoTo( '#editor' )
	    		}

    		})
    	}).catch((result) => {
        	if ( result.response.message ) {
	            app.flash.Error( "<strong>Sorry!</strong> ", result.response.message );
	        }
    	}).finally(() => {
    		this.userPassword('');
    		this.isLoginSubmitting(false);
    	});
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PageLogin, template: templateMarkup };
