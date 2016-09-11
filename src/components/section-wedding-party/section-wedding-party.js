import ko from 'knockout';
import 'bootstrap';
import templateMarkup from 'text!./section-wedding-party.html';

class WeddingPartySection {
    constructor(params) {
    	this.weddingParty = app.installation.sections.weddingParty;

    	for ( var i = 0, j = this.weddingParty.groups().length; i < j; i++ ) {
    		var group = this.weddingParty.groups()[i];
    		group.navTitle = group.title().split(" ")[0] + i;
    	}
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WeddingPartySection, template: templateMarkup };
