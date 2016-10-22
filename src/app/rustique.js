// import 'jquery-ui'; this randomly throws errors for some reason
import ko from 'knockout';
import 'jquery';
import 'bootstrap';
import 'knockout-postbox';
import 'knockout-projections';
import 'knockout-punches';
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
		this.overlayToShow = ko.observable(null);

		$('body').popover({
		    selector: '[data-toggle="popover"]',
		    trigger: 'hover'
		});

	}

	findInstallation() {

		this.api.get("api/installationInfo").then(( result ) => {
			this.installation = new InstallationModel( result.response.installation );
			this.hasLoadedData(true);
			this.isWeddingFound(true);
			this.setPageTitle(this.installation.name());
			this.getLoggedInUser();

		}).catch(( error ) => {
			console.log( "Request Failed: ", error );
			if ( error.status == 404 && error.responseJSON && error.responseJSON.message == 'Wedding site not found' ) {
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
			console.log( "Request Failed: ", error );
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

			setTimeout(() => {
				$('body').append('<scr'+'ipt src="//widget.cloudinary.com/global/all.js">' + '<\/scr'+'ipt>')
			}, 500)

			return result;
		}).catch((err) => {
			this.isUserLoggedIn(false);
			return err;
		}).finally(() => {
			this.onUpdateRoute(app.currentRoute())
		});
	}

	onUpdateRoute(newRoute, firstPageLoad = false) {
		// TO DO: maybe add something here to map /editor to /#editor, etc

	    //jQuery.scrollTo(0)

	    console.log('newRoute', newRoute);
	    console.log('firstPageLoad', firstPageLoad);

	    if ( (newRoute.isLoggedInPage || firstPageLoad) && app.loggedInUser == null ) {

	        if ( $.isEmptyObject( app.currentRoute() ) ) {
	            // If no current route set, and not logged in AND loading first page, then store asked for Hash for redirect after login
	            app.currentRoute().request_ = app.hasher.getHash()
	        }

	        app.redirectToLogin()
	    }

	    //app.UpdatePageTitle()

	}

	redirectToLogin( callback ) {
	    // Redirect to login but remember this page
	    if ( app.currentRoute().page !== "login" ) {
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

	    console.log('hash', hash);

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
	    	console.log('setting hash here', this);
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
	}

	Logout() {
		var firstName = app.loggedInUser.firstName()
		app.api.post('api/me/logout').then((result) => {
			app.loggedInUser = null;
			app.isUserLoggedIn(false);
			app.sidebarPosition('closed');
			app.GoTo( '' )
			app.flash.Success( `Okay ${firstName}, you are now signed out, don't be a stranger!` );
		});
	}



	setPageTitle(title) {
		document.title = title;
	}
}



export default Rustique;
