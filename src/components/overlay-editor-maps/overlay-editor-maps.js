import ko from 'knockout';
import templateMarkup from 'text!./overlay-editor-maps.html';
import MapModel from '../../models/mapModel';
import DirectionsModel from '../../models/directionsModel';

class OverlayEditMaps {
	constructor(params) {
		var maps = app.installation.sections.maps;

		this.id = ko.unwrap(maps.id);
		this.menuText = maps.menuText;
		this.isVisible = maps.isVisible;
		this.locations = ko.observableArray( ko.unwrap(maps.locations.slice(0)) );
		this.directions = ko.observableArray( ko.unwrap(maps.directions.slice(0)) );
		this.isDirty = maps.isDirty;
		this.resetData = maps.ResetData;
		this.defaultImages = [
			'images/event-ceremony.jpg',
			'images/event-party.jpg'
		];
		this.availableIcons = ['heart', 'glass', 'cutlery', 'music'];

		this.isSubmitting = ko.observable(false);
		this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Saving';
			} else {
				return 'Save My Changes';
			}
		});

		this.sectionId = ko.pureComputed(() => {
			return app.getContainerId(this.menuText);
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

		mapData.locations = [];
		mapData.directions = []

		for ( var loc of this.locations() ) {
			let startTime = loc.startTime() || moment();
			var mapObj = {
				title: loc.title(),
				description: loc.description(),
				latitude: loc.latitude(),
				longitude: loc.longitude(),
				address: loc.address(),
				startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
				mapIcon: loc.mapIcon(),
				image: loc.image()
			}
			if ( !loc.isNew ) {
				mapObj.id = loc.id()
			}
			mapData.locations.push(mapObj);
		}

		for ( var dir of this.directions() ) {
			var dirObj = {
				title: dir.title(),
				description: dir.description(),
				showLink: dir.showLink(),
				linkText: dir.linkText(),
				linkUrl: dir.linkUrl()
			}
			if ( !dir.isNew ) {
				dirObj.id = dir.id()
			}
			mapData.directions.push(dirObj);
		}
		console.log('mapData', mapData);
		//return;

		app.api.put(`/api/mapSections/${this.id}`, mapData).then((result) => {
			app.flash.Success('Updated baby!');
			app.updateInstallationData();
			this.Close();
			$.scrollTo( $(this.sectionId()), 1000, { offset: -$('#main-nav').height() } );
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

	OnClickDeleteDirections(dir) {
		var idx = app.utility.FindIndexByKeyValue(this.directions(), 'id', dir.id());
		if ( idx > -1 ) {
			this.directions.splice(idx, 1);
		}
	}

	OnClickEditImage(venue) {
		app.modal.Show("upload-image", { imageUrl: venue.image, editorOpts: { cropRatio: 1 }, defaultImages: this.defaultImages });
	}

	OnClickMapIcon(venue, icon) {
		venue.mapIcon(icon);
	}

	AddLocation(group) {
		var newMap = new MapModel({
			id: Date.now(),
			title: '',
            description: '',
			startTime: null,
            latitude: 40.7505,
            longitude: -73.9934,
			address: '',
			mapIcon: 'heart',
			image: 'images/event-ceremony.jpg',
            isNew: true,
			isEditing: true
		});
		this.locations.push(newMap);

	}

	AddDirections() {
		var newDirection = new DirectionsModel({
			id: Date.now(),
			title: '',
            description: '',
			showLink: true,
			linkText: '',
			linkUrl: '',
            isNew: true,
			isEditing: true
		});
		this.directions.push(newDirection);
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
