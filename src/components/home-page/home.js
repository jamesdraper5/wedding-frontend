import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
	constructor(route) {
		this.installation = app.installation;
		this.showAdmin = ko.observable(route.showAdmin || false);
	}

	OnRendered() {
		//ko.postbox.publish('home-page-rendered');

		/*
		if ( app.hasSidebar() ) {
			console.log('has sidebar');
			setTimeout(() => {
				console.log('here');
				app.sidebarPosition('open');
			}, 500);
		} else {
			console.log('no sidebar');
		}
		*/


	}



}

export default { viewModel: HomeViewModel, template: homeTemplate };
