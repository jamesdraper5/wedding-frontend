import ko from 'knockout';
import templateMarkup from 'text!./overlay-editor-maps.html';
import MapModel from '../../models/mapModel';

class OverlayEditMaps {
	constructor(params) {
		var maps = app.installation.sections.maps;

		this.id = ko.unwrap(maps.id);
		this.menuText = maps.menuText;
		this.isVisible = maps.isVisible;
		this.locations = ko.observableArray( ko.unwrap(maps.locations.slice(0)) );
		this.isDirty = maps.isDirty;

		this.resetData = maps.ResetData;

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

		$('.overlay-main').height(overlayHeight + 'px');
	}

	OnSubmit() {
		this.isSubmitting(true);
		var mapData = {
			title: '', // TO DO: wire this up
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

		app.api.put(`/api/mapSections/${this.id}`, mapData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
			$.scrollTo( $('#location-container'), 1000, { offset: -$('#main-nav').height() } )
		}).finally(() => {
			this.isSubmitting(false);
		});
	}

	OnClickDeleteMap(map) {
		var idx = app.utility.FindIndexByKeyValue(this.locations(), 'id', map.id());
		if ( idx > -1 ) {
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

	Cancel() {
		var self = this;
		var close = function() {
			self.Close(true);
		}

		if ( this.isDirty() ) {
			app.modal.Confirm('You have unsaved changes', 'Are you sure you want to discard these changes?.', close);
		} else {
			close();
		}

	}

	Close(reset=false) {
		if ( reset ) {
			app.installation.sections.maps.ResetData();
		}
		app.hideOverlay();
		app.GoTo('/editor');
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: OverlayEditMaps, template: templateMarkup };