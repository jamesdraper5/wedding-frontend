import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-maps.html';
import * as MapModel from '../../models/mapModel';

class OverlayEditMaps {
	constructor(params) {

		this.id = ko.unwrap(app.installation.sections.maps.id);
		this.title = ko.observable( ko.unwrap(app.installation.sections.maps.title) );
		this.menuText = ko.observable( ko.unwrap(app.installation.sections.maps.menuText) );
		this.isVisible = ko.observable( ko.unwrap(app.installation.sections.maps.isVisible) );
		this.locations = ko.observableArray( ko.unwrap(app.installation.sections.maps.locations.slice(0)) );

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save My Changes';
			}
		});

	}

	OnRendered() {
		var bodyHeight = $(window).height(),
			footerHeight = $('.overlay-footer').outerHeight(),
			overlayHeight = bodyHeight - footerHeight;

		$('#overlay-main').height(overlayHeight + 'px');
	}

	OnSubmit() {
		this.isSubmitting(true);
		var mapData = {
			title: this.title(),
			isVisible: this.isVisible(),
			menuText: this.menuText()
		};

		mapData.locations = []

		for ( var loc of this.locations() ) {
			var mapObj = {
				title: loc.title(),
				description: loc.description(),
				latitude: loc.latitude(),
				longitude: loc.longitude()
			}
			if ( !loc.isNew ) {
				mapObj.id = loc.id()
			}
			mapData.locations.push(mapObj);
		}

		app.api.put(`api/mapSections/${this.id}`, mapData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	OnClickDeleteMap(map) {
		var idx = app.utility.FindIndexByKeyValue(this.locations(), 'id', map.id());
		if ( idx > -1 ) {
			console.log('this', this);
			this.locations.splice(idx, 1);
		}
	}

	AddLocation(group) {
		var newMap = new MapModel({
			id: Date.now(),
			title: "New Map",
            description: "",
            latitude: 40.7505,
            longitude: -73.9934,
            isNew: true
		});
		this.locations.push(newMap);

	}

	Close() {
		app.hideOverlay();
		app.GoTo('editor')
	}

	dispose() {
		console.log('dispose');
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayEditMaps, template: templateMarkup };
