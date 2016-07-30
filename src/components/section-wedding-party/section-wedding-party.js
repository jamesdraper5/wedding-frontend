import ko from 'knockout';
import 'bootstrap';
import templateMarkup from 'text!./section-wedding-party.html';

class WeddingPartySection {
    constructor(params) {
    	this.weddingParty = app.installation.sections.weddingParty;
    	console.log('weddingParty', this.weddingParty);

    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WeddingPartySection, template: templateMarkup };
