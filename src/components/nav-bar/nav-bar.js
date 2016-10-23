import ko from 'knockout';
import template from 'text!./nav-bar.html';

class NavBarViewModel {
    constructor(params) {
        this.route = params.route;
        this.installation = app.installation;

        this.menuIcon = ko.pureComputed(() => {
        	if ( app.sidebarPosition() === 'open' ) {
        		return 'x'
        	} else {
        		return '<i class="glyphicon glyphicon-align-justify"></i>'
        	}
        });

        this.navbarClass = ko.pureComputed(() => {
        	var className = '';
        	if ( app.overlayToShow() == null ) {
        		className += 'navbar-fixed-top ';
        	}
        	className += app.sidebarPosition();
        	return className;
        });

    }

    OnClickToggleSidebar() {
    	if ( app.sidebarPosition() === 'open' ) {
    		app.sidebarPosition( 'closed' )
    	} else {
    		app.sidebarPosition( 'open' )
    	}

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
