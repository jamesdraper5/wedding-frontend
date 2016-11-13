import ko from 'knockout';
import templateMarkup from 'text!./modal-upload-image.html';

class ModalUploadImage {
    constructor(params) {
    	this.callback = params.callback;
    	this.title = params.title || 'Upload Image';
    	this.imageUrl = params.imageUrl || ko.observable('images/lucy.jpg');

    	app.modal.Init('UploadImage', this, params)
    }

    OnShow() {
        //$("#modalConfirmBtn").focus()
    }

    OnClickCancel() {
        this.Close()
    }

    OnClickConfirm() {
        this.Close()

        if ( this.callback != null ) {
            this.callback()
        }
    }

    Close() {
    	app.modal.Close(this, false);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: ModalUploadImage, template: templateMarkup };
