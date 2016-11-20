import ko from 'knockout';
import darkroom from 'darkroom';
import templateMarkup from 'text!./widget-image-editor.html';

class WidgetImageEditor {
	/*
	@params:
		file: imageSrc File - this will
		imageSrc: observable String - image src to update
		isEditing: observable Boolean - is Darkroom currently active
		useEditor: Boolean - if false then just preview selected file
		editorOpts: Object - settings for Darkroom
		uid: Number - unique id for UI / subscriptions
	*/
	constructor(params) {
		this.file = params.file || ko.observable(null)
		this.imageSrc = params.imageSrc || ko.observable(null)
		this.editorOpts = params.editorOpts || {};
		this.isEditing = (params.isEditing != null ? params.isEditing : ko.observable(false));
		this.useEditor = (params.useEditor != null ? params.useEditor : true)
		this.uid = params.uid || Date.now();

		this.inputId = 'image-upload-' + this.uid
		this.imgId = 'image-' + this.uid
		this.fileName = null;
		this.originalImgSrc = this.imageSrc();
		this.previewImgSrc = ko.observable(this.imageSrc())
		this.allowedMimeTypes = ['image/jpeg', 'image/png'];

		// Subscriptions
		this.subscriptions = [];
		this.editBtnText = ko.pureComputed(() => {
			return this.isEditing() ? 'Cancel Editing' : 'Edit Image'
		});
		this.subscriptions.push(this.editBtnText);
		$(document).on('change', '#'+this.inputId, (evt) => this.OnFileInputChange(evt) )

	}

	/******************************
	* Event Handlers
	******************************/

	OnFileInputChange(evt) {
		var files = evt.target.files;

		if ( FileReader ) {
			if ( files && files.length ){
				this.onFileSelected(files[0])
			} else {
				app.flash.Info('No file selected')
			}
		} else {
			// TO DO: need fallback for shit browsers
		}

	}

	onFileSelected(file) {

		if ( this.allowedMimeTypes.indexOf(file.type) === -1 ) {
			app.flash.Info('Hold Up', 'Only image files can be selected')
			return;
		}

		this.file(file)

		var fr = new FileReader();
		fr.onload = () => {
			this.previewImgSrc(fr.result); // Need to add image src to preview img so we can edit it
		}
		fr.readAsDataURL(file);
	}

	OnClickToggleEdit() {
		this.isEditing( !this.isEditing() )

		if ( this.isEditing() ) {

			// this will happen when editing the existing file, without using the filepicker to pick a new one
			if ( this.fileName == null ) {
				this.fileName = this.originalImgSrc;
			}

			this.initEditor()
		} else {
			this.cancelEditor()
		}
	}

	OnClickFilePicker() {
		$('#'+this.inputId).trigger('click')
	}

	OnFinishedEditing() {
		var base64String = this.darkroom.sourceImage.toDataURL();
		var generatedFile = this.dataURItoFile(base64String, this.fileName);
		this.destroyDarkroom(base64String)
		this.file(generatedFile)
		this.isEditing(false)
	}


	/******************************
	* Workers
	******************************/

	initEditor() {
		const opts = this.editorOpts;
		var maxWidth = $('.modal-body').width();
		var self = this;
		this.darkroom = new Darkroom('#'+this.imgId, {
			// Size options
			minWidth: opts.minWidth || 100,
			minHeight: opts.minHeight || 100,
			maxWidth: opts.maxWidth || $('.uploader-body').width(),
			maxHeight: opts.maxHeight || 1000,
			ratio: opts.ratio || 4/3,
			backgroundColor: '#000',
			plugins: {
				crop: {
				  ratio: opts.cropRatio || 4/3
				},
				save: {
					callback: self.OnFinishedEditing.bind(self)
				}
			},
			// Post initialize script
			initialize: function() {
				var cropPlugin = this.plugins['crop'];
				cropPlugin.requireFocus();
				self.isEditing(true);
			}
		});
	}

	cancelEditor() {
		$('#'+this.inputId).val('')
		this.destroyDarkroom(this.originalImgSrc)
	}

	destroyDarkroom(src) {
		this.previewImgSrc(src);
		$('#'+this.imgId).insertBefore('#'+this.inputId).show();
		$('.darkroom-container').remove();
	}

	dataURItoFile(dataURI, name) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var type = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new File([ia], name, {type:type});
	}

	/******************************
	* UI
	******************************/


	dispose() {
		this.subscriptions.forEach((sub) => sub.dispose())
		$(document).off('change', '#'+this.inputId, this.OnFileInputChange)
	}
}

export default { viewModel: WidgetImageEditor, template: templateMarkup };
