import ko from 'knockout';
//import 'jquery';
import templateMarkup from 'text!./section-home.html';

class HomeSection {
	constructor(params) {
		this.subscriptions = [];
		this.homeData = app.installation.sections.home;
		this.weddingDate = this.homeData.weddingDate.format(app.constants.DATEFORMATS.long);
		this.containerId = this.homeData.menuText().toLowerCase().split(' ').join('-') + '-container';
		this.partnerOneName = this.homeData.partnerOneName;
		this.partnerTwoName = this.homeData.partnerTwoName;
		this.subscriptions.push(this.partnerOneInitial = ko.pureComputed(() => {
			return this.partnerOneName().charAt(0);
		}));
		this.subscriptions.push(this.partnerTwoInitial = ko.pureComputed(() => {
			return this.partnerTwoName().charAt(0);
		}));
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: HomeSection, template: templateMarkup };
