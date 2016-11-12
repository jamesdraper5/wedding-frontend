// import 'jquery-ui'; this randomly throws errors for some reason
import ko from 'knockout';
import 'jquery';
import 'bootstrap';
import 'knockout-postbox';
import 'knockout-projections';
import 'knockout-punches';
import 'jquery-scrollTo';
import 'bindings-ladda';
import 'bindings-image-uploader';
import 'extenders-trackChanges';
import * as mapping from 'knockout-mapping';
import * as api from '../helpers/api';
import * as router from './router';
import * as InstallationModel from 'installationModel';
import * as LoggedInUserModel from 'loggedInUserModel';
import * as FlashHelper from '../helpers/flash';
import * as ModalHelper from '../helpers/modal';
import * as ErrorHelper from '../helpers/errorHelper';
import * as UtilityHelper from '../helpers/utility';
import { constants as Constants } from '../helpers/constants';

class Rustique {
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

	findInstallation() {

		this.api.get("api/installationInfo", {}, {errorCodesToIgnore: [404]}).then(( result ) => {
			this.installation = new InstallationModel( result.response.installation );
			this.validateInitialRoute()
		}).catch(( error ) => {
			console.error( "Request Failed: ", error );
			if ( error.status == 404 ) {
				this.hasLoadedData(true); // We're not setting this.isWeddingFound to true here
			} else {
				this.hasLoadedData(true);
				this.hasError(true);
			}
		});
	}

	updateInstallationData() {
		this.api.get("api/installationInfo").then(( result ) => {
			this.installation.UpdateData(result.response.installation);
		}).catch(( error ) => {
			console.error( "Request Failed: ", error );
			this.hasError(true);
		});
	}

	getLoggedInUser() {
		return this.api.get("api/me", null, { emitError: false }).then(( result ) => {
			if ( this.loggedInUser != null ) {
				this.loggedInUser.UpdateData(result.response.data);
			} else { // First time login
				this.loggedInUser = new LoggedInUserModel(result.response.data)
				//this.showWelcomeModal() // TO DO: low priority
			}
			this.isUserLoggedIn(true);

			/*
			setTimeout(() => {
				$('body').append('<scr'+'ipt src="//widget.cloudinary.com/global/all.js">' + '<\/scr'+'ipt>')
			}, 500)
			*/

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
			console.log('1');
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
		// TO DO: maybe add something here to map /editor to /#editor, etc

	    //$.scrollTo(0)

	    console.log('onUpdateRoute - newRoute', newRoute.request_);

	    this.validateRoute(newRoute.request_)

	    if ( newRoute.isLoggedInPage && app.loggedInUser == null ) {

	        if ( $.isEmptyObject( app.currentRoute() ) ) {
	            // If no current route set, and not logged in, then store asked for Hash for redirect after login
	            app.currentRoute().request_ = app.hasher.getHash()
	        }

	        app.redirectToLogin()
	    }

	    this.checkEditorStatus();


	    //app.UpdatePageTitle() TO DO: dynamic page titles

	}

	validateRoute(hash) {
		var redirect = () => {
			if ( app.isUserLoggedIn() ) {
				app.GoTo('editor');
			} else {
				app.GoTo('');
			}
		}

		// hash will be null when a shite url is passed in or the router isn't initialized
		if ( hash == null || !this.isValidRoute(hash) ) {
			redirect()
		}
	}

	isValidRoute(hash) {
	    console.log('isValidRoute - hash', '"' + hash + '"');

	    if ( hash === '' ) return true;

	    var segments = hash.split('/');
	    var section = this.validRoutes[segments[0]];

	    console.log('segments', segments);
	    console.log('section', section);

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
	        app.GoTo("#login")
	    }
	    return false
	}


	// For navigating around the app
	// Pass the silent flag to change it without the app updating
	// Handy for when something is added ie. we just set the url, the app doesn't react
	// option: onNotFound - a callback function for when the next item isn't found
	GoTo(hash, inOpts) {
	    console.assert( hash.indexOf("http") === -1, "Don't use GoTo for full URLs" )

	    var opts = {
	        format: true,
	        onNotFound: null,
	        silent: false
	    }
	    $.extend(opts, inOpts)

	    if (opts.format) {
	        hash = hash.toLowerCase()
	    }

	    this.router.onNextItemNotFound = opts.onNotFound // ok for this not to exist

	    if (opts.silent) {
	        this.hasher.changed.active = false
	        this.hasher.setHash(hash)
	        this.hasher.changed.active = true
	    } else {
	        this.hasher.setHash(hash)
	    }
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
		app.api.post('api/me/logout').then((result) => {
			app.loggedInUser = null;
			app.isUserLoggedIn(false);
			app.sidebarPosition('closed');
			app.hideOverlay();
			if (redirect) {
				app.GoTo('')
			}
			app.flash.Success( `Okay ${firstName}, you are now signed out, don't be a stranger!` );
		});
	}



	setPageTitle(title) {
		document.title = title;
	}
}



export default Rustique;
