import ko from 'knockout';
import templateMarkup from 'text!./section-rsvp.html';
import Validator from '../../helpers/validation';

class RsvpSection {
	constructor(params) {
		this.validator = new Validator();
		this.rsvp = app.installation.sections.rsvp;
		this.containerId = this.rsvp.menuText().toLowerCase().split(' ').join('-') + '-container';
		this.isAttending = ko.observable(null);
		this.emailAddress = ko.observable('');
		this.phoneNumber = ko.observable('');
		this.firstName = ko.observable('');
		this.lastName = ko.observable('');
		this.comment = ko.observable('');
		this.songChoice = ko.observable(null);
		this.plusOnes = ko.observableArray([{name: '', uid: Date.now()}])
		this.numGuests = ko.pureComputed(() => {
			return this.plusOnes.length;
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
		this.guestName = ko.pureComputed(() => {
			return this.firstName() + ' ' + this.lastName();
		});
	}

	validateForm() {

		var isValid = this.validator.ValidateAll([
			{ input: this.emailAddress, inputName: 'Your email address', typeCheck: 'isEmail' },
			{ input: this.guestName, inputName: 'Your name', typeCheck: 'notEmpty' }
		]);

		return isValid;

	}

	OnClickAddGuest() {
		this.plusOnes.push({name: '', uid: Date.now()});
	}

	OnClickRemoveGuest(guest) {
		var idx = app.utility.FindIndexByKeyValue(this.plusOnes(), 'uid', guest.uid);
		if ( idx > -1 ) {
			this.plusOnes.splice(idx, 1);
		}
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
			numGuests: this.numGuests,
			comment: this.comment(),
			isAttending: this.isAttending()
		}
		//return false;
		app.api.post(`/api/rsvps/${rsvpId}/reply`, data).then((result) => {
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
