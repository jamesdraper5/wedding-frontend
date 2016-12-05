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
		this.currentRoute({ page: 'page-home', path: ctx.path, showNav: true })
	}

	showEditor(ctx) {
		console.log('ctx', ctx);

		var routeData = { page: 'page-home', path: ctx.path, isLoggedInPage: true, isEditorPage: true, showNav: true };

		if ( ctx.params && ctx.params.section ) {
			routeData.pageToEdit = ctx.params.section;
		}

		this.currentRoute(routeData)
		console.log('this.currentRoute', this.currentRoute());
	}

	showAccount(ctx) {
		this.currentRoute({ page: 'page-home', path: ctx.path, isLoggedInPage: true, showNav: true })
	}

	showLogin(ctx) {
		this.currentRoute({ page: 'page-login', path: ctx.path, isLoggedInPage: false, showNav: false })
	}

	showForgotPassword(ctx) {
		this.currentRoute({ page: 'page-forgot-password', path: ctx.path, isLoggedInPage: false, showNav: false })
	}

	showResetPassword(ctx) {
		this.currentRoute({ page: 'page-reset-password', path: ctx.path, isLoggedInPage: false, showNav: false })
	}

	show404(ctx) {
		this.currentRoute({ page: 'page-404', path: ctx.path, isLoggedInPage: false, showNav: false })
	}

	setRoute(path) {
		page(path)
	}

}

const routerInstance = new Router();

export default routerInstance;
