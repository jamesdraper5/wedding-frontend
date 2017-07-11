import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
	constructor(route) {
		this.installation = app.installation;
		this.showAdmin = ko.observable(route.showAdmin || false);
		this.adTracker = null;
		this.ecommerceTracker = null;

		this.checkForMessages(route.qryParams);
	}

	checkForMessages(data) {
		if ( data.pid && parseInt(data.pid, 10) > 0 && app.installation.isPaid() ) {
			app.flash.Success('Congratulations, your site is now live! Thanks for being an awesome customer!');
			this.recordSale(data);
		}
		if ( data.ccu && data.ccu == 1 && app.installation.isPaid() ) {
			app.flash.Success('Your payment details have been updated. Thanks for being an awesome customer!');
		}
	}

	recordSale(data) {
		//if ( window.devMode ) return;
		var selectedPlan = app.constants.PRICEPLANS.find((plan) => plan.id == data.pid);
        var planName = selectedPlan.name;
        var paymentAmount = selectedPlan.price;
        var transactionId = Math.floor( Math.random() * 10000 ).toString() + Date.now().toString();

		// Google Adwords data
		this.adTracker = setInterval(() => {
			if ( window.google_trackConversion != null ) {
				window.google_trackConversion({
					google_conversion_id: 850867738,
					google_conversion_language: "en",
					google_conversion_format: "3",
					google_conversion_color: "ffffff",
					google_conversion_label: "Q32VCL_Y9XIQmuzclQM",
					google_conversion_value: paymentAmount.toFixed(2),
					google_conversion_currency: "USD",
					google_remarketing_only: false
				});
				clearInterval(this.adTracker);
			}
		}, 200);

		this.ecommerceTracker = setInterval(() => {
			if ( window.ga && ga.hasOwnProperty('loaded') && ga.loaded === true ) {
				ga('ecommerce:addTransaction', {
					'id': transactionId,
					'affiliation': 'Wedding Pixie',
					'revenue': paymentAmount,
					'currency': 'USD'
				});
				ga('ecommerce:addItem', {
					'id': transactionId,
					'name': planName,
					'quantity': '1',
					'category': 'Wedding Pixie Plans',
					'price': paymentAmount
				});
				ga('ecommerce:send');
				ga('ecommerce:clear');
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'Wedding Pixie',
					'eventAction': 'Paid',
					'eventLabel': planName,
					'eventValue': paymentAmount
				});
				clearInterval(this.ecommerceTracker);
				console.log('ecommerce tracked')
			}
		}, 200);

	}


	OnRendered() {
		// this might be useful as it's a callback after the home page is fully rendered
	}

}

export default { viewModel: HomeViewModel, template: homeTemplate };
