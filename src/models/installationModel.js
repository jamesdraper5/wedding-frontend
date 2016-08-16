import ko from 'knockout';
import * as mapping from 'knockout-mapping';

class InstallationModel {
    constructor(data) {
        mapping.fromJS(data, {}, this);
        this.activeSections = ko.pureComputed(this.generateLinks, this);
    }

    generateLinks() {
        var activeSections = [];
        var sections = this.sections;
        for ( var section in sections ) {
            if ( sections.hasOwnProperty(section) && this.sections[section] != null ) { // TO DO: `&& this.sections[section].isVisible` - waiting on adding `isVisible` to each JSON section
                activeSections.push( this.sections[section].linkText );
            }
        }
        return activeSections;
    }
}

export default InstallationModel;