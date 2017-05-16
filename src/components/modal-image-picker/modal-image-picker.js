import ko from 'knockout';
import templateMarkup from 'text!./modal-image-picker.html';

class ModalImagePicker {
	constructor(params) {
		this.callback = params.callback;
		this.images = params.images;
		this.usePostbox = params.usePostbox;
		this.uid = params.uid;

		this.selectedImage = ko.observable(null);

		console.assert(Array.isArray(this.images) && this.images.length > 0, 'images param must be a non-empty array');

		// Subscriptions
		this.subscriptions = [];


		app.modal.Init('ImagePicker', this, params)
	}


	/******************************
	* Event Handlers
	******************************/
	OnSelectImage(img, e) {
		this.selectedImage(img);
		$('.image-picker--image-holder').removeClass('selected');
		$(e.target).closest('.image-picker--image-holder').addClass('selected');
	}

	OnClickCancel() {
		this.Close()
	}

	OnClickConfirm() {
		this.Close()

		if ( this.callback != null ) {
			this.callback(this)
		} else if ( this.usePostbox && this.uid ) {
			ko.postbox.publish('image-picker-selection-'+this.uid, {
				image: this.selectedImage()
			})
		}
	}

	/******************************
	* Workers
	******************************/




	/******************************
	* UI
	******************************/




	Close() {
		app.modal.Close(this, false);
	}

	dispose() {
		this.subscriptions.forEach((sub) => sub.dispose())
	}
}

export default { viewModel: ModalImagePicker, template: templateMarkup };
