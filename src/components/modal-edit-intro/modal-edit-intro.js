import ko from 'knockout';
import templateMarkup from 'text!./modal-edit-intro.html';

class ModalWelcomeMessage {
    constructor(params) {

    	this.id = params.id;
    	this.title = ko.observable( params.title );
    	this.content = ko.observable( params.content );
    	this.linkText = ko.observable( params.linkText );

    	this.isSubmitting = ko.observable(false);
    	this.btnText = ko.pureComputed(() => {
    	    if ( this.isSubmitting() ) {
    	        return 'Saving';
    	    } else {
    	        return 'Save';
    	    }
    	});

        // Setup OnShow
        app.modal.Init('edit-intro', this, params);
    }

    OnShow() {
        return;
    }

    OnSubmit() {
    	this.isSubmitting(true);
    	var introData = {
    		header: this.title(),
    		content: this.content(),
    		linkText: this.linkText()
    	};
    	app.api.put(`api/intros/${this.id}`, introData).then((result) => {
    		app.flash.Success('Updated baby!');
    		this.Close();
    	}).finally(() => {
    		this.isSubmitting(false);
    	});
    }

    Close() {
        app.modal.Close(this, false);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: ModalWelcomeMessage, template: templateMarkup };
