import ko from 'knockout';
import templateMarkup from 'text!./widget-footer-cta.html';

class WidgetFooterCta {
    constructor(params) {

    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WidgetFooterCta, template: templateMarkup };
