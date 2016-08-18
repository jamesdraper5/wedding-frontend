import ko from 'knockout';
import templateMarkup from 'text!./admin-panel.html';

class AdminPanel {
    constructor(params) {
        this.message = ko.observable('Hello from the admin-panel component!');
    }

    OnClickEditOption(opt) {
    	console.log('click', opt);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: AdminPanel, template: templateMarkup };
