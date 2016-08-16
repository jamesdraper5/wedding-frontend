import ko from 'knockout';
import templateMarkup from 'text!./section-rsvp.html';

class RsvpSection {
    constructor(params) {
    	this.rsvp = app.installation.sections.rsvp;
    	//console.log('this.rsvp', this.rsvp);

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

    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: RsvpSection, template: templateMarkup };
