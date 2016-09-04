/*
Params:
koObservable = the observable to update with the uploaded image url
uploadOpts = params to pass to Cloudinary for the image upload
*/

import ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as cloudinary from 'cloudinary';

ko.bindingHandlers.imageUploader = {

	init: (element, valueAccessor) => {

		var subscriptions = [];
		var options = ko.unwrap(valueAccessor());
		var uploadOpts = options.uploadOpts || {};
		var defaults = {
			cloud_name: 'dmxoe62jp',
			upload_preset: 'sluxhzvc',
			folder: 'test',
			multiple: false,
			cropping: 'server',
			cropping_aspect_ratio: 1,
			theme: 'white',
			button_class: 'btn btn-primary',
			button_caption: 'Edit Image',
			thumbnails: false,
			thumbnail_transformation: {
				width: 200,
				height: 200,
				crop: 'crop',
				gravity: 'custom'
			}
		}

		_.defaults(uploadOpts, defaults);

		$(element).cloudinary_upload_widget( uploadOpts, (error, result) => {
			console.log(error, result)
			if ( result && result.length ) {
				//window.open(result[0].thumbnail_url, '_blank');

				if ( options.koObservable != null ) {
					options.koObservable( result[0].thumbnail_url );
				}
			}
		});

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			subscriptions.forEach((subscription) => {
				subscription.dispose();
			});
		});

	}
}
