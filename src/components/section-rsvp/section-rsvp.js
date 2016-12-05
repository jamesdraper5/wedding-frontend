import ko from 'knockout';
import templateMarkup from 'text!./section-rsvp.html';
import * as Validator from '../../helpers/validation';

class RsvpSection {
	constructor(params) {
		this.validator = new Validator();
		this.rsvp = app.installation.sections.rsvp;
		this.containerId = this.rsvp.menuText().toLowerCase().split(' ').join('-') + '-container';
		this.isAttending = ko.observable(true);
		this.numGuests = ko.observable(0);
		this.emailAddress = ko.observable('');
		this.guestName = ko.observable('');
		this.comment = ko.observable('');
		this.guestType = ko.observable(0);
		this.numPermittedGuests = ko.pureComputed(() => {
			console.log('this.guestType()', this.guestType());
			var guestCount = 0;
			switch( parseInt(this.guestType(), 10) ) {
				case 0:
					guestCount = 0;
					break;
				case 1:
					guestCount = 1;
					break;
				case 2:
					guestCount = 4;
					break;
				default:
					guestCount = 0;
			}
			console.log('guestCount', guestCount);
			return guestCount;
		});

		this.isSubmitting = ko.observable(false);
		this.hasSubmitted = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Sending RSVP';
			} else if ( this.hasSubmitted() ) {
				return 'RSVP Sent';
			} else {
				return 'Send';
			}
		});
	}

	validateForm() {

		var isValid = this.validator.ValidateAll([
			{ input: this.emailAddress, inputName: 'Your email address', typeCheck: 'isEmail' },
			{ input: this.guestName, inputName: 'Your name', typeCheck: 'notEmpty' }
		]);

		return isValid;

	}

	OnSubmit() {

		if ( !this.validateForm() ) {
			return false;
		}

		this.isSubmitting(true);

		var rsvpId = this.rsvp.id();
		var data = {
			name: this.guestName(),
			emailAddress: this.emailAddress(),
			numGuests: this.numGuests(),
			comment: this.comment(),
			isAttending: this.isAttending()
		}
		console.log('data', data);
		//return false;
		app.api.post(`/api/rsvps/${rsvpId}/reply`, data).then((result) => {
			console.log('result', result);
			app.flash.Success('RSVP Sent!', 'Excellent, thanks for getting back to us!!')
			setTimeout(() => {
				this.hasSubmitted(true)
			}, 200);
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: RsvpSection, template: templateMarkup };
