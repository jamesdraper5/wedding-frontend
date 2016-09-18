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

		this.findInstallation();

		this.hasSidebar = ko.pureComputed(() => {
			return this.currentRoute().hasAdmin && this.isUserLoggedIn();
		});

		this.sidebarPosition = ko.observable('closed');
		this.overlayToShow = ko.observable(null);


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
			if ( error.status == 404 && error.responseJSON.message != null && error.responseJSON.message == 'Wedding site not found' ) {
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
			return result;
		}).catch((err) => {
			this.isUserLoggedIn(false);
			return err;
		});
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

			app.flash.Success( `Okay ${firstName}, you are now signed out, don't be a stranger!` );
		});
	}



	setPageTitle(title) {
		document.title = title;
	}
}



export default Rustique;
