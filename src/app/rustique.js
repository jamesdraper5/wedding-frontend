import ko from 'knockout';
import 'bindings-ladda';
import 'jquery';
import 'bootstrap';
import 'knockout-projections'
import 'knockout-punches'
import * as api from '../helpers/api';
import * as router from './router';
import * as InstallationModel from 'installationModel';
import * as FlashHelper from '../helpers/flash';
import * as ErrorHelper from '../helpers/errorHelper';

class Rustique {
    constructor(config) {

        this.api = api;
        this.router = router;
        this.currentRoute = router.currentRoute;
        this.flash = new FlashHelper();
        this.errorHelper = new ErrorHelper();
        this.api.on('error', this.errorHelper.Ajax);

        this.hasLoadedData = ko.observable(false);
        this.isWeddingFound = ko.observable(false);
        this.hasError = ko.observable(false);
        this.isUserLoggedIn = ko.observable(false);

        this.findInstallation();
    }

    findInstallation() {

        this.api.get("api/installationInfo").then(( result ) => {
            this.installation = new InstallationModel( result.response.installation );
            this.hasLoadedData(true);
            this.isWeddingFound(true);
            this.setPageTitle(this.installation.name());

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

    setPageTitle(title) {
        document.title = title;
    }
}



export default Rustique;
