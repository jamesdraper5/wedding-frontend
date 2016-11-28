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

		this.routes = [
			{ url: '',                      params: { page: 'page-home' } },
			{ url: 'editor',                params: { page: 'page-home', isLoggedInPage: true, isEditorPage: true } },
			{ url: 'editor/:pageToEdit:',   params: { page: 'page-home', isLoggedInPage: true, isEditorPage: true } },
			{ url: 'account',               params: { page: 'page-home', isLoggedInPage: true } },
			{ url: 'login',   	            params: { page: 'page-login', isLoggedInPage: false, showNav: false } },
			{ url: 'forgotpassword', 		params: { page: 'page-forgot-password', isLoggedInPage: false, showNav: false } },
			{ url: 'resetpassword/{token}', params: { page: 'page-reset-password', isLoggedInPage: false, showNav: false } }
		]

		/*
		for ( var route of this.routes ) {
			page(route, (ctx) => this.handleRoute(ctx, route))
		}
		*/

		page('editor', this.test)

		page.start();

	}

	test(ctx) {
		console.log('test', ctx);

		this.currentRoute({ page: 'page-home', isLoggedInPage: true, isEditorPage: true, showNav: true })
	}

	handleRoute(ctx, route) {

		console.log('ctx', ctx);
		console.log('route', route);

		// Defaults
		if ( route.params.showNav == null ) {
			route.params.showNav = true;
		}

		//route.params.path =

		this.currentRoute(route.params)
	}

	navigateToPath(path) {
		page(path)
	}

}

const routerInstance = new Router();

export default routerInstance;
