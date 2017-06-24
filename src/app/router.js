'use strict';

import ko from 'knockout';
import page from 'page';

class Router {
	constructor(config) {
		this.currentRoute = ko.observable({});
		this.isConfirmingChanges = ko.observable(false);

		page('/', this.showHomePage.bind(this));
		page('/editor/:section', this.showAdmin.bind(this));
		page('/editor', this.showAdmin.bind(this));
		page('/settings/:section', this.showAdmin.bind(this));
		page('/settings', this.showAdmin.bind(this));
		page('/account', this.showAccount.bind(this));
		page('/login', this.showLogin.bind(this));
		page('/publish', this.showPaymentsPage.bind(this));
		page('/forgotpassword', this.showForgotPassword.bind(this));
		page('/resetpassword/:token', this.showResetPassword.bind(this));
		page('*', this.show404.bind(this));

		page.start();

	}

	showHomePage(ctx) {
		this.currentRoute({ page: 'page-home', path: ctx.path, showNav: true, showSidebar: false, showAdminHeader: true });
	}

	showAdmin(ctx) {
		var routeData = { page: 'page-home', path: ctx.path, isLoggedInPage: true, isAdminPage: true, showNav: true, showSidebar: true, showAdminHeader: true };

		// if there's a `section` value, then we're gonna open an overlay - need to know which one
		if ( ctx.params && ctx.params.section ) {
			var segments = ctx.path.split('/');
		    segments.shift(); // Remove the first element, as it will be an empty string
			routeData.pageToEdit = segments.join('-');
		}

		this.currentRoute(routeData);
	}

	showAccount(ctx) {
		this.currentRoute({ page: 'page-home', path: ctx.path, isLoggedInPage: true, showNav: true, showSidebar: true, showAdminHeader: true });
	}

	showLogin(ctx) {
		this.currentRoute({ page: 'page-login', path: ctx.path, isLoggedInPage: false, showNav: false, showSidebar: false, showAdminHeader: false });
	}

	showForgotPassword(ctx) {
		this.currentRoute({ page: 'page-forgot-password', path: ctx.path, isLoggedInPage: false, showNav: false, showSidebar: false, showAdminHeader: false });
	}

	showResetPassword(ctx) {
		this.currentRoute({ page: 'page-reset-password', path: ctx.path, token: ctx.params.token, isLoggedInPage: false, showNav: false, showSidebar: false, showAdminHeader: false });
	}

	showPaymentsPage(ctx) {
		this.currentRoute({ page: 'page-billing', path: ctx.path, isLoggedInPage: true, showNav: false, showSidebar: false, showAdminHeader: false });
	}

	show404(ctx) {
		this.currentRoute({ page: 'page-404', path: ctx.path, isLoggedInPage: false, showNav: false, showSidebar: false, showAdminHeader: false });
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
