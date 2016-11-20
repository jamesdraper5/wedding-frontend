import ko from 'knockout';
import templateMarkup from 'text!./modal-upload-image.html';

class ModalUploadImage {
	constructor(params) {
		this.callback = params.callback;
		this.title = params.title || 'Upload Image';
		this.editorOptions = params.editorOptions || {};
		this.imageUrl = params.imageUrl || ko.observable(null);

		this.uid = Date.now();
		this.file = ko.observable(null);
		this.isEditing = ko.observable(false);
		this.isSubmitting = ko.observable(false);

		// Subscriptions
		this.subscriptions = [];
		this.subscriptions.push( this.btnText = ko.pureComputed(() => this.isSubmitting() ? 'Updating Image...' : 'Okay') )

		app.modal.Init('UploadImage', this, params)
	}


	/******************************
	* Event Handlers
	******************************/

	OnClickCancel() {
		this.Close()
	}

	OnSubmit() {
		this.isSubmitting(true);
		if ( this.file() !== null ) {
			// TO DO: if editor is still open, prompt user to save or cancel editor
			this.getSignedRequest(this.file())
		} else {
			this.Close()
		}
	}

	OnClickConfirm() {
		this.Close()

		if ( this.callback != null ) {
			this.callback()
		}
	}

	/******************************
	* Workers
	******************************/

	// @file: File - file object
	getSignedRequest(file) {

		var url = 'api/files/sign-s3'
		var postData = {
			fileName: this.uid + '-' + app.installation.id() + '-' + file.name,
			fileType: file.type
		}

		app.api.post(url, postData).then((result) => {
			let data = result.response.data;
			console.log('signed request result - data', data);
			this.uploadFile(file, data.signedRequest, data.url);
		}).catch((err) => {
			console.log('err', err);
			app.flash.Error('Uh Oh...', 'Sorry, there seems to be an issue adding images at the moment, please try again')
		})
	}

	// @file: File - a File object
	uploadFile(file, signedRequestUrl, imageUrl) {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedRequestUrl);
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4){
				if(xhr.status === 200){
					this.isSubmitting(false);
					this.imageUrl(imageUrl)
					app.flash.Success('Image Updated')
					this.Close()
				} else{
					app.flash.Error('Oh No!', 'Sorry, there seems to be an issue adding images at the moment, please try again')
				}
			}
		};
		xhr.send(file);
	}




	/******************************
	* UI
	******************************/




	Close() {
		app.modal.Close(this, false);
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: ModalUploadImage, template: templateMarkup };
