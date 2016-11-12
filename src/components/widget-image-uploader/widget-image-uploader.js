import ko from 'knockout';
import templateMarkup from 'text!./widget-image-uploader.html';

class WidgetImageUploader {
    constructor(params) {
    	this.observable = params.observable || ko.observable(null)
    	this.inputId = 'image-upload-' + Date.now()
    	this.listenToInput()

    	console.log('asdasdada');
    }

    listenToInput() {
    	var self = this;
        $(document).on('change', '#'+this.inputId, function() {
            if ( this.files && this.files.length ){
	            self.getSignedRequest( this.files[0] );
            } else {
	            app.flash.Info('No file selected')
            }
        })
    }

    getSignedRequest(file) {
      	var url = `api/files/sign-s3?file-name=${file.name}&file-type=${file.type}`;
      	app.api.get(url).then((result) => {
      		let data = result.response.data;
      		console.log('data', data);
    		this.uploadFile(file, data.signedRequest, data.url);
      	}).catch((err) => {
      		console.log('err', err);
            app.flash.Error('Uh Oh...', 'Sorry, there seems to be an issue adding images at the moment, please try again')
      	})
    }

	uploadFile(file, signedRequestUrl, imageUrl) {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedRequestUrl);
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4){
				if(xhr.status === 200){
					this.observable(imageUrl)
				} else{
					app.flash.Error('Oh No!', 'Sorry, there seems to be an issue adding images at the moment, please try again')
				}
			}
		};
		xhr.send(file);
	}

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WidgetImageUploader, template: templateMarkup };
