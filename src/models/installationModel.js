import ko from 'knockout';
import * as mapping from 'knockout-mapping';

class InstallationModel {
    constructor(data) {
        this.UpdateData(data);
        this.activeSections = ko.pureComputed(this.generateLinks, this);
    }

    UpdateData(data) {
    	mapping.fromJS(data, {}, this);
    }

    generateLinks() {
        var activeSections = [];
        var sections = this.sections;
        for ( var section in sections ) {
            if ( sections.hasOwnProperty(section) && this.sections[section] != null ) { // TO DO: `&& this.sections[section].isVisible` - waiting on adding `isVisible` to each JSON section
                activeSections.push( this.sections[section].menuText );
            }
        }
        return activeSections;
    }
}

export default InstallationModel;
