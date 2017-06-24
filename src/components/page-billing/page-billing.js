import ko from 'knockout';
import templateMarkup from 'text!./page-billing.html';

const stripe = Stripe('pk_test_GEDGmnDIJeqEbjPIK5w4jo0G');
const elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
const styles = {
	base: {
		iconColor: '#8898AA',
		color: 'white',
		lineHeight: '36px',
		fontWeight: 300,
		fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
		fontSize: '19px',
		'::placeholder': {
			color: '#8898AA',
		}
    },
    invalid: {
    	iconColor: '#e85746',
    	color: '#e85746'
    }
};

class PageBilling {
	constructor(params) {
		this.subscriptions = [];
		this.userName = ko.observable('');

		// Create an instance of the card Element
		this.card = elements.create('card', {
			iconStyle: 'solid',
			style: styles,
			classes: {
				focus: 'is-focused',
				empty: 'is-empty'
			}
		});
		this.card.mount('#card-element');

		var inputs = document.querySelectorAll('input.field');
		Array.prototype.forEach.call(inputs, function(input) {
			input.addEventListener('focus', function() {
				input.classList.add('is-focused');
			});
			input.addEventListener('blur', function() {
				input.classList.remove('is-focused');
			});
			input.addEventListener('keyup', function() {
				if (input.value.length === 0) {
					input.classList.add('is-empty');
				} else {
					input.classList.remove('is-empty');
				}
			});
		});

		this.card.on('change', (event) => {
			console.log('event', event)
			if ( event.error ) {
				this.displayError(event.error);
			}
		});


	}

	async OnSubmit() {
		var extraDetails = {
			name: this.userName()
		};
		//stripe.createToken(this.card, extraDetails).then(this.stripeTokenHandler);

		const {token, error} = await stripe.createToken(this.card, extraDetails);

		console.log('token, error', token, error);

		if (error) {
			// Inform the user if there was an error
			this.displayError(error);
		} else {
			// Send the token to your server
			this.stripeTokenHandler(token);
		}

	}

	displayError(error) {
		console.log('error', error)
		var errorElement = document.querySelector('.error');
		errorElement.classList.remove('visible');
		errorElement.textContent = error.message;
		errorElement.classList.add('visible');
	}

	stripeTokenHandler(token) {
		// Insert the token ID into the form so it gets submitted to the server

		console.log('token', token);



		let data = {
			stripeToken: token.id,
			userName: this.userName(),
			email: app.loggedInUser.email()
		}

		app.api.post('api/subscriptions', data).then((result) => {
			console.log('result', result);
		})
	}


	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
		for ( let sub of this.subscriptions ) {
			sub.dispose();
		}
	}
}

export default { viewModel: PageBilling, template: templateMarkup };
