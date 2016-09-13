import ko from 'knockout';
import templateMarkup from 'text!./section-maps.html';
import * as GoogleMapsLoader from 'google-maps';

class MapsSection {
	constructor(params) {
		this.title = app.installation.sections.maps.menuText;
		this.maps = app.installation.sections.maps.locations;
		// TO DO: Add map marker to styles
		this.themeStyles = {
			paris: [
				{
					featureType: "all",
					stylers: [{ saturation: -80 }]
				},
				{
					featureType: "road.arterial",
					elementType: "geometry",
					stylers: [{ hue: "#00ffee" }, { saturation: 50 }]
				},
				{
					featureType: "poi.business",
					elementType: "labels",
					stylers: [{ visibility: "off" }]
				}
			]
		};

		GoogleMapsLoader.KEY = 'AIzaSyBdlmh7fqtInzVycyxMmzS4n9rAvZSlZYI';

	}

	OnRendered() {
		var self = this;
		GoogleMapsLoader.load(function(google) {
			self.createMaps(google);
		});
	}

	createMaps(google) {
		for ( var map of this.maps() ) {
			var el = document.getElementById('map' + map.id());
			var locationCenter = {
				lat: parseFloat(map.latitude(), 10),
				lng: parseFloat(map.longitude(), 10)
			};
			var options = {
				center: locationCenter,
				styles: this.themeStyles[app.installation.themeClass()],
				zoom: 15,
				scrollwheel: false
			};
			var pinImage = 'images/heart.png';
			var gmap = new google.maps.Map(el, options);

			var marker = new google.maps.Marker({
				position: locationCenter,
				title: map.title(),
				animation: google.maps.Animation.DROP,
				icon: pinImage
			});

			// To add the marker to the map, call setMap();
			marker.setMap(gmap)
		}
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: MapsSection, template: templateMarkup };
