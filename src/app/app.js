// import 'jquery-ui'; this randomly throws errors for some reason
import ko from 'knockout';
import 'jquery';
import 'bootstrap';
import 'knockout-postbox';
import 'knockout-projections';
import 'knockout-punches';
import 'jquery-scrollTo';
import 'bindings-bot-checker';
import 'bindings-date-picker';
import 'bindings-ladda';
import 'bindings-image-uploader';
import 'bindings-move-labels';
import 'extenders-trackChanges';
import * as mapping from 'knockout-mapping';
import Raven from 'raven';
import api from '../helpers/api';
import router from './router';
import InstallationModel from 'installationModel';
import LoggedInUserModel from 'loggedInUserModel';
import FlashHelper from '../helpers/flash';
import ModalHelper from '../helpers/modal';
import ErrorHelper from '../helpers/errorHelper';
import UtilityHelper from '../helpers/utility';
import { constants as Constants } from '../helpers/constants';

class App {
	constructor(config) {

		this.api = api;
		this.router = router;
		this.hasher = router.hasher;
		this.currentRoute = router.currentRoute;
		this.flash = new FlashHelper();
		this.errorHelper = new ErrorHelper();
		this.modal = new ModalHelper();
		this.utility = new UtilityHelper();
		this.modals = ko.observableArray(); //used or tracking loaded modals components
		this.constants = Constants;

		if ( !window.devMode ) {
			Raven.config('https://8ef7d6007fea4ce6bc61f2a67d674530@sentry.io/158665').install();
		}

		this.api.on('error', this.errorHelper.Ajax);

		this.hasLoadedData = ko.observable(false);
		this.isWeddingFound = ko.observable(false);
		this.hasError = ko.observable(false);
		this.isUserLoggedIn = ko.observable(false);
		this.currentRoute.subscribe((newRoute) => {
			this.onUpdateRoute(newRoute)
		});

		this.findInstallation();

		this.hasSidebar = ko.pureComputed(() => {
			return this.currentRoute().isLoggedInPage && this.isUserLoggedIn();
		});
		this.sidebarPosition = ko.observable('closed');
		this.overlayToShow = ko.observable( null );
		this.sidebarWidth = 260;
		this.viewPortWidth = ko.observable($('body').width())
        this.viewPortHeight = ko.observable($('body').height())
		this.overlayLeftPos = ko.pureComputed(() => {
			return (this.viewPortWidth() > 768 ? `${this.sidebarWidth}px` : 0)
		})
		this.overlayWidth = ko.pureComputed(() => {
			if ( this.viewPortWidth() > 768 ) {
				return (this.viewPortWidth() - this.sidebarWidth) + 'px';
			} else {
				return '100%'
			}
		})

		this.validRoutes = {
			login: true,
			forgotpassword: true,
			resetpassword: true,
			editor: {
				subroutes: [
					'home',
					'intro',
					'maps',
					'rsvp',
					'weddingparty'
				]
			}
		}

		$(window).resize(() => {
		    var $body = $('body')
		    this.viewPortWidth( $body.width() )
		    this.viewPortHeight( $body.height() )
		})

		$('body').popover({
		    selector: '[data-toggle="popover"]',
		    trigger: 'hover'
		});

	}

	initStyles(theme) {
		var styleSheet = document.styleSheets[document.styleSheets.length-1];
		switch(theme) {
			case 'paris':
				var bg = `url( ${this.installation.sections.home.mainImage()} )`;
				this.addCSSRule(styleSheet, "#home-container", "background-image: " + bg, styleSheet.cssRules.length);
				break;
		}
	}

	findInstallation() {

		this.api.get("/api/installationInfo", {}, {errorCodesToIgnore: [404]}).then(( result ) => {
			this.installation = new InstallationModel( result.response.installation );
			this.validateInitialRoute();
			console.log('this.installation', this.installation);
			this.initStyles(this.installation.themeClass());
			this.setRavenUser()
		}).catch(( error ) => {
			if ( error.status == 404 ) {
				this.hasLoadedData(true); // We're not setting this.isWeddingFound to true here
			} else {
				this.hasLoadedData(true);
				this.hasError(true);
			}
		});
	}

	updateInstallationData() {
		this.api.get("/api/installationInfo").then(( result ) => {
			this.installation.UpdateData(result.response.installation);
			setTimeout(() => {
				console.log('yes');
				this.initStyles(this.installation.themeClass())
			}, 200);
		}).catch(( error ) => {
			console.error( "Request Failed: ", error );
			this.hasError(true);
		});
	}

	getLoggedInUser() {
		return this.api.get("/api/me", null, { emitError: false }).then(( result ) => {
			if ( this.loggedInUser != null ) {
				this.loggedInUser.UpdateData(result.response.data);
			} else { // First time login
				this.loggedInUser = new LoggedInUserModel(result.response.data)
				//this.showWelcomeModal() // TO DO: low priority
			}
			this.isUserLoggedIn(true);
			return result;
		}).catch((err) => {
			this.isUserLoggedIn(false);
			return err;
		});
	}

	validateInitialRoute() {
		var initPage = () => {
			this.onUpdateRoute(app.currentRoute())
			this.setPageTitle(this.installation.name());
			this.hasLoadedData(true);
			this.isWeddingFound(true);
		}

		if ( this.currentRoute().isLoggedInPage && app.loggedInUser == null ) {
			// If loggedInPage, make /api/me call then validate route and show page
			return this.getLoggedInUser().finally(() => {
				initPage()
			})
		} else {
			// else just validate route and show page immediately
			initPage()
		}
	}

	onUpdateRoute(newRoute) {

	    //console.log('onUpdateRoute - newRoute', newRoute.path);

	    this.validateRoute(newRoute.path)

	    if ( newRoute.isLoggedInPage && app.loggedInUser == null ) {
	    	//console.log('app.currentRoute()', app.currentRoute());
	        if ( $.isEmptyObject( app.currentRoute() ) ) {
	            // If no current route set, and not logged in, then store asked for Hash for redirect after login
	            app.currentRoute().path = window.location.pathname;
	        }

	        app.redirectToLogin()
	    }

	    this.checkEditorStatus();


	    //app.UpdatePageTitle() TO DO: dynamic page titles

	}

	validateRoute(path) {
		var redirect = () => {
			if ( app.isUserLoggedIn() ) {
				app.GoTo('/editor');
			} else {
				app.GoTo('/');
			}
		}

		// path will be null when a shite url is passed in or the router isn't initialized
		if ( path == null || !this.isValidRoute(path) ) {
			redirect()
		}
	}

	isValidRoute(path) {
	    //console.log('isValidRoute - path', '"' + path + '"');

	    if ( ['', '/'].indexOf(path) > -1 ) return true;

	    var segments = path.split('/');
	    segments.shift(); // Remove the first element, as it will be an empty string
	    var section = this.validRoutes[segments[0]];

	    if ( section != null ) { // does route exist in validRoutes
	    	if ( section.subroutes != null ) { // does the matched section have sub routes
	    		if ( segments.length > 1 && segments[1] != null ) {
	    			return section.subroutes.indexOf(segments[1]) > -1; // Does the second level of the url match one of the sub routes, e.g. /editor/maps
	    		} else {
	    			return true; // only a top level url was passed so we already have a match, e.g. /editor
	    		}
	    	} else {
	    		return true; // No sub routes, so the top level matches - success
	    	}
	    } else {
	    	return false; // Didn't match
	    }

	}

	checkEditorStatus() {
		var route = this.currentRoute()

		if ( this.isUserLoggedIn() ) {
			if ( route.isEditorPage ) {
				this.sidebarPosition('open')
			} else {
				this.sidebarPosition('closed')
			}
			if ( route.pageToEdit != null ) {
				var overlayName = `edit-${route.pageToEdit}`;
				var overlay = {
					name: overlayName,
					params: {}
				}
				this.showOverlay(overlay)
			} else {
				this.hideOverlay();
			}
		} else {
			this.sidebarPosition('closed')
			this.hideOverlay();
		}
	}

	redirectToLogin( callback ) {
	    // Redirect to login but remember this page
	    if ( app.currentRoute().page !== "login" ) {
	        this.flash.Error('You shall not pass!', 'You need to be logged in before you can access that page')
	        app.requestedRouteBeforeLoginRedirect = app.currentRoute()
	        app.GoTo("/login")
	    }
	    return false
	}


	// For navigating around the app
	// Pass the silent flag to change it without the app updating
	// Handy for when something is added ie. we just set the url, the app doesn't react
	// option: onNotFound - a callback function for when the next item isn't found
	GoTo(path) {
	    console.assert( path.indexOf("http") === -1, "Don't use GoTo for full URLs" )

	    this.router.setRoute(path)
	}

	showOverlay(overlay) {
		app.overlayToShow(overlay);
		$('body').addClass('no-scroll');
	}

	hideOverlay() {
		app.overlayToShow(null);
		$('body').removeClass('no-scroll');
		//app.GoTo('editor');
	}

	Logout(redirect=false) {
		var firstName = app.loggedInUser.firstName()
		app.api.post('/api/me/logout').then((result) => {
			app.loggedInUser = null;
			app.isUserLoggedIn(false);
			app.sidebarPosition('closed');
			app.hideOverlay();
			if (redirect) {
				app.GoTo('/')
			}
			app.flash.Success( `Okay ${firstName}, you're now signed out, don't be a stranger!` );
		});
	}

	setPageTitle(title) {
		document.title = title;
	}

	// Sets current raven user for sentry tracking
	setRavenUser() {
	    if ( window.devMode ) return;
        var opts = {};
        if ( this.installation != null ) {
            opts.installationId = this.installation.id();
            opts.installation = this.installation.url();
        }
	    Raven.setUserContext(opts);
	}

	SendSentryError(errorMessage, opts={}) {
	    if ( Raven != null && !window.devMode ) {
	    	opts.level = opts.level || 'error';
	    	opts.extra = opts.extra || {};
	        Raven.captureMessage(errorMessage, {
	        	level: opts.level,
	        	extra: opts.extra
	        });
	    }
	}

	// Handy for theme-related styles
	addCSSRule(sheet, selector, rules, index) {
		if("insertRule" in sheet) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		}
		else if("addRule" in sheet) {
			sheet.addRule(selector, rules, index);
		}
	}

}



export default App;
