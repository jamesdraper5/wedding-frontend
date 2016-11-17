import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
	constructor(route) {
		this.installation = app.installation;
		this.showAdmin = ko.observable(route.showAdmin || false);
	}

	OnRendered() {
		// this might be useful as it's a callback after the home page is fully rendered


	}

}

export default { viewModel: HomeViewModel, template: homeTemplate };
