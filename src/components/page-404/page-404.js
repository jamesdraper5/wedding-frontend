import ko from 'knockout';
import templateMarkup from 'text!./page-404.html';

class Page404 {
	constructor(params) {

	}

	goBack() {
		window.history.back()
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: Page404, template: templateMarkup };
