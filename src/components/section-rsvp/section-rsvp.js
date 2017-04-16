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
		this.songChoice = ko.observable('');
		this.extraGuests = ko.observableArray([])

		this.userIsHuman = ko.observable(false); // don't let them submit form until we're sure they're not a spambot
		this.isSubmitting = ko.observable(false);
		this.hasSubmitted = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Sending RSVP';
			} else if ( this.hasSubmitted() ) {
				return 'RSVP Sent';
			} else {
				return 'Send RSVP';
			}
		});
		this.guestName = ko.pureComputed(() => {
			return this.firstName() + ' ' + this.lastName();
		});
	}

	validateForm() {

		var isValid = this.validator.ValidateAll([
			{ input: this.firstName, inputName: 'Your first name', typeCheck: 'notEmpty' },
			{ input: this.lastName, inputName: 'Your last name', typeCheck: 'notEmpty' },
			{ input: this.phoneNumber, inputName: 'Your phone number', typeCheck: 'notEmpty' },
		]);

		if ( isValid && this.isAttending() == null ) {
			app.flash.Error( "<strong>Oops!</strong> ", 'Please specify whether you can attend or not');
			isValid = false;
		}

		return isValid;

	}

	OnClickAddGuest() {
		this.extraGuests.push({name: '', uid: Date.now()});
	}

	OnClickRemoveGuest(guest) {
		var idx = app.utility.FindIndexByKeyValue(this.extraGuests(), 'uid', guest.uid);
		if ( idx > -1 ) {
			this.extraGuests.splice(idx, 1);
		}
	}

	OnSubmit() {

		var rsvpId = this.rsvp.id();
		var data = {
			name: this.guestName(),
			extraGuests: this.extraGuests().map((guest) => guest.name),
			emailAddress: this.emailAddress(),
			phone: this.phoneNumber(),
			comment: this.comment(),
			isAttending: this.isAttending(),
			song: this.songChoice(),

		}

		if ( !this.userIsHuman() ) {
			app.flash.Error( "<strong>Hmmmm...</strong>", "This is awkward - we think you might be a spam bot. Please try again");
			app.SendSentryError('Possible spambot form submission', { level: 'warning', extra: data });
			return false;
		}

		if ( !this.validateForm() ) {
			return false;
		}

		this.isSubmitting(true);

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
