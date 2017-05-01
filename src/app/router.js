'use strict';

import ko from 'knockout';
import page from 'page';

class Router {
	constructor(config) {
		this.currentRoute = ko.observable({});
		this.isConfirmingChanges = ko.observable(false);

		page('/',  this.showHomePage.bind(this));
		page('/editor/:section',  this.showEditor.bind(this));
		page('/editor',  this.showEditor.bind(this));
		page('/account',  this.showAccount.bind(this));
		page('/login',  this.showLogin.bind(this));
		page('/forgotpassword',  this.showForgotPassword.bind(this));
		page('/resetpassword/:token',  this.showResetPassword.bind(this));
		page('*', this.show404.bind(this));

		page.start();

	}

	showHomePage(ctx) {
		this.currentRoute({ page: 'page-home', path: ctx.path, showNav: true });
	}

	showEditor(ctx) {
		var routeData = { page: 'page-home', path: ctx.path, isLoggedInPage: true, isEditorPage: true, showNav: true };

		if ( ctx.params && ctx.params.section ) {
			routeData.pageToEdit = ctx.params.section;
		}

		this.currentRoute(routeData);
	}

	showAccount(ctx) {
		this.currentRoute({ page: 'page-home', path: ctx.path, isLoggedInPage: true, showNav: true });
	}

	showLogin(ctx) {
		this.currentRoute({ page: 'page-login', path: ctx.path, isLoggedInPage: false, showNav: false });
	}

	showForgotPassword(ctx) {
		this.currentRoute({ page: 'page-forgot-password', path: ctx.path, isLoggedInPage: false, showNav: false });
	}

	showResetPassword(ctx) {
		this.currentRoute({ page: 'page-reset-password', path: ctx.path, token: ctx.params.token, isLoggedInPage: false, showNav: false });
	}

	show404(ctx) {
		this.currentRoute({ page: 'page-404', path: ctx.path, isLoggedInPage: false, showNav: false });
	}

	// force: change route even if there are unsaved form changes
	setRoute(path, force=false) {

		if ( !force && app.utility.DoesFormHaveChanges() ) {

			app.modal.Confirm('You have unsaved changes', 'Are you sure you want to discard these changes?', () => {
				app.utility.IgnoreFormChanges();
				app.ResetCurrentPageData();
				page(path);
			});

		} else {
			page(path);
		}
	}
}

const routerInstance = new Router();

export default routerInstance;
