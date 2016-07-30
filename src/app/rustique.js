import ko from 'knockout';
import * as InstallationModel from 'installationModel'

class Rustique {
    constructor(config) {
        //this.installation = ko.observable(null);
        this.hasLoadedData = ko.observable(false);
        this.findInstallation();
    }

    findInstallation() {
        var url = window.location.hostname;
        $.getJSON( "api/installationInfo", {
           url: url
		})
		.done(( result ) => {
    		console.log( "JSON Data: ", result );

            this.installation = new InstallationModel( result.installation );
            this.hasLoadedData(true);
            this.setPageTitle(this.installation.name());

  		})
  		.fail(( jqxhr, textStatus, error ) => {
    		var err = textStatus + ", " + error;
    		console.log( "Request Failed: ", err );
            this.hasLoadedData(true);
    	});
	}

    setPageTitle(title) {
        document.title = title;
    }
}



export default Rustique;
