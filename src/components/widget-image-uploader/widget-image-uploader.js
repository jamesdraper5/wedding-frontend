import ko from 'knockout';
import darkroom from 'darkroom';
import templateMarkup from 'text!./widget-image-uploader.html';

class WidgetImageUploader {
    constructor(params) {
    	this.observable = params.observable || ko.observable(null)
    	this.useEditor = params.useEditor || false;
    	this.uid = params.uid || Date.now();
    	this.inputId = 'image-upload-' + this.uid
    	this.imgId = 'image-' + this.uid
    	this.listenToInput()
    	this.fileName = null;
    	this.fileType = null;
    	this.subscriptions = [];
    	this.subscriptions.push( ko.postbox.subscribe(`image-edited-${this.uid}`, () => {
    		console.log('okay');
    		this.OnSaveEdits()
    	}))
    }

    listenToInput() {
    	var self = this;
        $(document).on('change', '#'+this.inputId, function() {
            if ( FileReader ) {
	            if ( this.files && this.files.length ){
		            self.onFileSelected(this.files[0])
	            } else {
		            app.flash.Info('No file selected')
	            }
	        } else {
	        	// TO DO: need fallback for shit browsers
	        }
        })
    }

    onFileSelected(file) {
    	this.fileName = this.uid + '-' + file.name;
    	this.fileType = file.type;

    	if ( !this.useEditor ) {
	    	this.getSignedRequest( file );
	    	return;
    	}

        var fr = new FileReader();
        fr.onload = () => {
            this.observable(fr.result); // Need to add image src to preview img so we can edit it
        	this.initEditor()
        }
        fr.readAsDataURL(file);
    }

    initEditor() {
    	var maxWidth = $('.modal-body').width();
    	var self = this;
    	new Darkroom('#'+this.imgId, {
    		// Size options
    		minWidth: 100,
    		minHeight: 100,
    		maxWidth: maxWidth,
    		maxHeight: 600,
    		ratio: 4/3,
    		backgroundColor: '#000',
    		plugins: {
    			crop: {
    			  ratio: 4/3
    			},
    			save: {
    				callback: self.OnSaveEdits.bind(self)
    			}
    		},
    		// Post initialize script
    		initialize: function() {
    			var cropPlugin = this.plugins['crop'];
    			cropPlugin.requireFocus();
    			self.darkroom = this;
    		}
    	});
    }

    OnSaveEdits() {
		var base64String = this.darkroom.sourceImage.toDataURL();
		var generatedFile = this.dataURItoFile(base64String, this.fileName, this.fileType);
		this.getSignedRequest(generatedFile);
		this.destroyDarkroom(base64String)
	}

    destroyDarkroom(src) {
    	$('#'+this.imgId).insertBefore('#'+this.inputId).attr('src',src).show();
    	$('.darkroom-container').remove();
    }

    dataURItoFile(dataURI, name, type) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        if ( type == null ) {
        	type = dataURI.split(',')[0].split(':')[1].split(';')[0];
        }

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new File([ia], name, {type:type});
    }


    // @filetype: String - 'file' or 'base64'
    getSignedRequest(fileData) {

      	var url = 'api/files/sign-s3'
      	var postData = {
      		fileName: this.fileName,
      		fileType: this.fileType
      	}

      	app.api.post(url, postData).then((result) => {
      		let data = result.response.data;
      		console.log('signed request result - data', data);
    		this.uploadFile(fileData, data.signedRequest, data.url);
      	}).catch((err) => {
      		console.log('err', err);
            app.flash.Error('Uh Oh...', 'Sorry, there seems to be an issue adding images at the moment, please try again')
      	})
    }

    // @fileData: Object - either a File object or an object containing a base64 encoded image string
	uploadFile(fileData, signedRequestUrl, imageUrl) {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedRequestUrl);
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4){
				if(xhr.status === 200){
					this.observable(imageUrl)
					app.flash.Success('Image Uploaded')
					ko.postbox.publish(`image-uploaded-${this.uid}`)
				} else{
					app.flash.Error('Oh No!', 'Sorry, there seems to be an issue adding images at the moment, please try again')
				}
			}
		};
		xhr.send(fileData);
	}

	OnClickImage() {
		$('#'+this.inputId).trigger('click')
	}

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WidgetImageUploader, template: templateMarkup };
