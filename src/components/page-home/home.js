import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
	constructor(route) {
		this.installation = app.installation;
		this.showAdmin = ko.observable(route.showAdmin || false);
		this.checkForMessages(route.qryParams);
	}

	checkForMessages(data) {
		if ( data.pid && parseInt(data.pid, 10) > 0 && app.installation.isPaid() ) {
			app.flash.Success('Congratulations, your site is now live! Thanks for being an awesome customer!');
		}
	}

	OnRendered() {
		// this might be useful as it's a callback after the home page is fully rendered


	}

}

export default { viewModel: HomeViewModel, template: homeTemplate };
