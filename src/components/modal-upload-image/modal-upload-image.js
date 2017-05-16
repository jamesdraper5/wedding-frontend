import ko from 'knockout';
import templateMarkup from 'text!./modal-upload-image.html';
import Raven from 'raven';

class ModalUploadImage {
	constructor(params) {
		this.callback = params.callback;
		this.title = params.title || 'Upload Image';
		this.editorOpts = params.editorOpts || {};
		this.imageUrl = params.imageUrl || ko.observable(null);
		this.defaultImages = params.defaultImages || [];

		this.uid = Date.now();
		this.file = ko.observable(null);
		this.isEditing = ko.observable(false);
		this.isSubmitting = ko.observable(false);

		// Subscriptions
		this.subscriptions = [];
		this.subscriptions.push( this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Updating Image...'
			} else if ( this.isEditing() ) {
				return 'Confirm Changes'
			} else {
				return 'Save Image'
			}
		}));

		this.subscriptions.push( ko.postbox.subscribe('image-picker-selection-'+this.uid, (data) => this.OnSelectDefaultImage(data)) );

		app.modal.Init('UploadImage', this, params)
	}


	/******************************
	* Event Handlers
	******************************/
	OnSelectDefaultImage(data) {
		app.flash.Success('Image Updated');
		this.imageUrl(data.image)
		this.Close()
	}

	OnClickCancel() {
		this.Close()
	}

	OnSubmit() {
		if ( this.isEditing() ) {
			ko.postbox.publish('save-image-edits-'+this.uid)
			return;
		}

		if ( this.file() !== null ) {
			this.isSubmitting(true);
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

		var url = '/api/files/sign-s3'
		var newFileName;

		if ( file.name.indexOf('amazonaws.com') > -1 ) {
		    // Remove the URL from the file name - this will leave it with the same name as it had originally, so the file will be overwritten
		    var arr = file.name.split('amazonaws.com/');
		    arr.shift();
		    newFileName = arr.join();
		} else {
			newFileName = app.installation.id() + '/' + this.uid + '-' + file.name;
		}

		if ( newFileName.indexOf('?uid=') !== -1 ) {
			newFileName = newFileName.split('?uid=')[0];
		}

		var postData = {
			fileName: newFileName,
			fileType: file.type
		}

		app.api.post(url, postData).then((result) => {
			let data = result.response.data;
			this.uploadFile(file, data.signedRequest, data.url);
		}).catch((err) => {
			app.flash.Error('Uh Oh...', 'Sorry, there seems to be an issue adding images at the moment, please try again')
			Raven.captureMessage('Error getting s3 signed request', {
                extra: {
                	error: err
                }
            });
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
				} else {
					app.flash.Error('Oh No!', 'Sorry, there seems to be an issue adding images at the moment, please try again');
					Raven.captureMessage('Error uploading image to s3', {
		                extra: {
		                	error: err
		                }
		            });
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
		this.subscriptions.forEach((sub) => sub.dispose())
	}
}

export default { viewModel: ModalUploadImage, template: templateMarkup };
