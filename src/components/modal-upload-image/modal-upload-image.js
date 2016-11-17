import ko from 'knockout';
import templateMarkup from 'text!./modal-upload-image.html';

class ModalUploadImage {
	constructor(params) {
		this.callback = params.callback;
		this.title = params.title || 'Upload Image';
		this.uid = Date.now();
		this.imageUrl = params.imageUrl || ko.observable(null);
		this.isSubmitting = ko.observable(false)
		this.subscriptions = [];
		this.subscriptions.push( ko.postbox.subscribe(`image-uploaded-${this.uid}`, () => this.Close() ) )

		app.modal.Init('UploadImage', this, params)
	}

	OnShow() {
		//$("#modalConfirmBtn").focus()
	}

	OnClickCancel() {
		this.Close()
	}

	OnSubmit() {
		// TO DO: Ladda button stuff
		ko.postbox.publish(`save-image-${this.uid}`)
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
