import ko from 'knockout';
import templateMarkup from 'text!./widget-map.html';
import * as GoogleMapsLoader from 'google-maps';

class WidgetMap {
	constructor(params) {
		GoogleMapsLoader.KEY = 'AIzaSyBdlmh7fqtInzVycyxMmzS4n9rAvZSlZYI';

		// TO DO: Add map marker to styles
		this.map = params.map;
		this.uid = Date.now();
		this.mapHeight = params.mapHeight || '300px';
		this.isEditMode = params.isEditMode || false;
		this.googleMap = null;
		this.googleMarker = null;
		this.google = null;
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
		this.subscriptions = [];
		this.setInitialLocation();

		if ( this.isEditMode ) {
			this.subscriptions.push( ko.postbox.subscribe('update-gmap-location', (data) => this.updateLocation(data) ) )
		}
	}

	OnRendered() {
		console.log('OnRendered');
		GoogleMapsLoader.load((google) => {
			this.geocoder = new google.maps.Geocoder();
			this.renderGoogleMap(google);
		});
	}

	renderGoogleMap(google) {
		var el = document.getElementById('map' + this.uid);
		var locationCenter = {
			lat: parseFloat(this.map.latitude(), 10),
			lng: parseFloat(this.map.longitude(), 10)
		};
		var options = {
			center: locationCenter,
			styles: this.themeStyles[app.installation.themeClass()],
			zoom: 15,
			scrollwheel: false
		};
		var pinImage = 'images/heart.png';

		this.googleMap = new google.maps.Map(el, options);
		this.googleMarker = new google.maps.Marker({
			position: locationCenter,
			title: this.map.title(),
			animation: google.maps.Animation.DROP,
			icon: pinImage,
			draggable: this.isEditMode
		});

		if ( this.isEditMode ) {
			google.maps.event.addListener(this.googleMarker, 'dragend', () => {
				var position = this.googleMarker.getPosition();
				this.geocodePosition(position);
				this.map.latitude( position.lat() )
				this.map.longitude( position.lng() )
			});

			this.subscriptions.push( this.map.address.subscribe((address) => {
				this.googleMarker.setTitle(address);
			}));
		}

		// To add the marker to the map, call setMap();
		this.googleMarker.setMap(this.googleMap)
	}

	// @pos: { lat: float, lng: float }
	geocodePosition(pos) {
	   	this.geocoder.geocode({
			latLng: pos
		}, (results, status) => {
			if (status == google.maps.GeocoderStatus.OK) {
				this.map.address( results[0].formatted_address )
			} else {
				// TO DO: This should just be a toastr at most
				//app.modal.Alert('Oh Dear', 'We had a problem determining the address at this location. ')
			}
		});
	}

	// @address: string
	geocodeAddress(address) {
        this.geocoder.geocode({
        	'address': address
        }, (results, status) => {
	        if (status === 'OK') {
	        	if ( results.length ) {
		            this.googleMap.setCenter(results[0].geometry.location);
		            this.googleMarker.setPosition(results[0].geometry.location);
		            this.map.latitude( results[0].geometry.location.lat() )
		            this.map.longitude( results[0].geometry.location.lng() )
		        } else {
		        	app.modal.Alert('This is Awkward...', 'We couldn\'t find a location for this address. Please check that you have entered it correctly. If you have, then that\'s our bad. If you try entering a less specific, or a nearby address, you can then drag the marker on the map to the exact location. Sorry about that.')
		        }
		    } else if ( status === 'ZERO_RESULTS' ) {
	        	app.modal.Alert('This is Awkward...', 'We couldn\'t find a location for this address. Please check that you have entered it correctly. If you have, then that\'s our bad. If you try entering a less specific, or a nearby address, you can then drag the marker on the map to the exact location. Sorry about that.')
	        } else {
	            app.modal.Alert('This is Awkward...', 'We had a problem determining the location for this address. Please try again.')
	        }
        });
	}

	setInitialLocation() {
		if ( !this.isEditMode ) return;

		// The inital location is set to Times Square in the DB.
		// If it hasn't been edited then ask user for their current location to set map marker, else return
		if ( this.map.latitude() !== '40.7505' && this.map.longitude() !== '-73.9934' ) {
			return;
		}
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.moveMarker( position.coords.latitude, position.coords.longitude )
				this.map.latitude( position.coords.latitude );
				this.map.longitude( position.coords.longitude );
			});
		}
	}

	moveMarker( lat, lng ) {
		this.googleMap.panTo( new google.maps.LatLng( lat, lng ) );
		this.googleMarker.setPosition( new google.maps.LatLng( lat, lng ) );
		this.map.latitude( lat );
		this.map.longitude( lng );
	}

	updateLocation(data) {
		if ( data.id === this.map.id() ) {
			this.geocodeAddress(data.address);
		}
	}

	dispose() {
		this.subscriptions.forEach((sub) => {
			sub.dispose()
		})
	}
}

export default { viewModel: WidgetMap, template: templateMarkup };
