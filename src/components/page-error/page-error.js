import ko from 'knockout';
import templateMarkup from 'text!./page-error.html';

class PageError {
    constructor(params) {
        this.message = ko.observable('Hello from the page-error component!');
    }
    
    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PageError, template: templateMarkup };
