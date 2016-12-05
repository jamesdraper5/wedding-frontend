import ko from 'knockout';
import page from 'page';

// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.

class Router {
	constructor(config) {
		this.currentRoute = ko.observable({});

		page('/',  this.showHomePage.bind(this));
		page('/editor',  this.showEditor.bind(this));
		page('/editor/:section',  this.showEditor.bind(this));
		page('/account',  this.showAccount.bind(this));
		page('/login',  this.showLogin.bind(this));
		page('/forgotpassword',  this.showForgotPassword.bind(this));
		page('/resetpassword/:token',  this.showResetPassword.bind(this));
		page('*', this.show404.bind(this));

		page.start();

	}

	showHomePage(ctx) {
		this.currentRoute({ page: 'page-home', showNav: true })
	}

	showEditor(ctx) {
		this.currentRoute({ page: 'page-home', isLoggedInPage: true, isEditorPage: true, showNav: true })
	}

	showAccount(ctx) {
		this.currentRoute({ page: 'page-home', isLoggedInPage: true, showNav: true })
	}

	showLogin(ctx) {
		this.currentRoute({ page: 'page-login', isLoggedInPage: false, showNav: false })
	}

	showForgotPassword(ctx) {
		this.currentRoute({ page: 'page-forgot-password', isLoggedInPage: false, showNav: false })
	}

	showResetPassword(ctx) {
		this.currentRoute({ page: 'page-reset-password', isLoggedInPage: false, showNav: false })
	}

	show404() {
		this.currentRoute({ page: 'page-404', isLoggedInPage: false, showNav: false })
	}

	getMatchingRoute(ctx) {
		console.log('ctx', ctx);
		let routes = this.routes.filter((route) => route.url === ctx.path )

		console.log('routes', routes);

		if ( routes.length ) {
			let route = routes[0];

			// Set any defaults required
			if ( route.params.showNav == null ) {
				route.params.showNav = true;
			}

			this.currentRoute( routes[0].params )
		}
	}

	setRoute(path) {
		page(path)
	}

}

const routerInstance = new Router();

export default routerInstance;
