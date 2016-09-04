import ko from 'knockout';
import template from 'text!./nav-bar.html';

class NavBarViewModel {
    constructor(params) {
        this.route = params.route;
        this.installation = app.installation;
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

    	app.api.post('api/authenticate', data).then((result) => {
    		console.log('result', result);
    		app.getLoggedInUser().then((result) => {
	    		app.flash.Success(`Welcome back ${app.loggedInUser.firstName()}!`);
	    		app.sidebarPosition('open');
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

    OnLogOut() {
    	app.Logout();
    }
}

export default { viewModel: NavBarViewModel, template: template };
