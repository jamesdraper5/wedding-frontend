import ko from 'knockout';
import templateMarkup from 'text!./widget-map.html';
import { default as GoogleMapsLoader } from 'google-maps';
import moment from 'moment';

var CustomMarker;

class WidgetMap {
	constructor(params) {
		GoogleMapsLoader.KEY = app.constants.GOOGLEMAPSKEY;

		// TO DO: Add map marker to styles
		this.map = params.map; // this is used in edit mode
		this.locationsArray = ko.unwrap(params.locationsArray) || []; // This is for showing multiple markers on one map in display mode
		this.uid = Date.now();
		this.mapHeight = params.mapHeight || '300px';
		this.isEditMode = params.isEditMode || false;
		this.googleMap = null;
		this.googleMarker = null;
		this.google = null;
		this.subscriptions = [];
		this.setInitialLocation();

		if ( this.isEditMode ) {
			this.subscriptions.push( ko.postbox.subscribe('update-gmap-location', (data) => this.updateLocation(data) ) )
		}
	}

	OnRendered() {
		GoogleMapsLoader.load((google) => {
			this.geocoder = new google.maps.Geocoder();
			this.renderGoogleMap(google);
		});
	}

	renderGoogleMap(google) {
		if ( this.isEditMode ) {
			this.renderEditableMap(google);
		} else {
			this.renderDisplayMap(google);
		}
	}

	renderEditableMap() {
		var el = document.getElementById('map' + this.uid);
		var locationCenter = {
			lat: parseFloat(this.map.latitude(), 10),
			lng: parseFloat(this.map.longitude(), 10)
		};
		var options = {
			center: locationCenter,
			styles: app.utility.getMapStyles( app.installation.theme.className() ),
			zoom: 15,
			scrollwheel: false
		};
		var pinImage = '/images/heart.png';

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

	renderDisplayMap() {

		function renderInfoContent(location) {
			return `<div class="map-info-window">
						<h3>${location.title()}</h3>
						<p class="map-info-window--date">${location.formattedStartTime()}</p>
						<p>
							<a href="https://maps.google.com/?daddr=${location.latitude()}%2C${location.longitude()}" class="highlight-color" target="_blank">Get Directions</a>
						</p>
					</div>`;
		}

		var el = document.getElementById('map' + this.uid);
		var bounds = new google.maps.LatLngBounds();
		var options = {
			styles: app.utility.getMapStyles( app.installation.theme.className() ),
			scrollwheel: false
		};

		var infoWindow = new google.maps.InfoWindow()

		this.googleMap = new google.maps.Map(el, options);

		// Loop through our array of markers & place each one on the map
	    for ( let location of this.locationsArray ) {
	        var position = new google.maps.LatLng(location.latitude(), location.longitude());
	        bounds.extend(position);

			let marker = this.createCustomMarker({
				position: position,
				map: this.googleMap,
				iconClass: location.mapIcon()
			});

	        // Allow each marker to have an info window
			google.maps.event.addListener(marker, 'click', () => {
	            infoWindow.setContent(renderInfoContent(location));
				infoWindow.open(this.googleMap, marker);
	        });

	        // Automatically center the map fitting all markers on the screen
	        this.googleMap.fitBounds(bounds);
	    }

	}

	createCustomMarker(opts) {

		// create this class for the first time. Have to do it this shitty way as we need to be sure the Google Maps API has loaded first
		if ( CustomMarker == null ) {
			CustomMarker = class CustomMarker extends google.maps.OverlayView {

				constructor(opts) {
					super();
					this.position = opts.position;
					this.iconClass = opts.iconClass || 'heart';
					this.setMap(opts.map);
					// These are the values used in the CSS - we use it here just to move the markers by e.g. markerWidth/2 to center them.
					// Can't do this in the CSS as the markers already have a 45deg trasnsform so they would get translated 45deg up/right
					this.markerWidth = 50;
					this.markerHeight = 50;
				}

				draw() {

					var div = this.div;
					var span, icon;

					if (!div) {

						div = this.div = document.createElement('div');
						span = document.createElement('span');
						icon = document.createElement('i');
						div.className = 'map-marker';
						icon.className = `fa fa-${this.iconClass}`;

						google.maps.event.addDomListener(div, "click", (event) => {
							google.maps.event.trigger(this, "click");
						});

						span.appendChild(icon);
						div.appendChild(span);

						var panes = this.getPanes();
						panes.overlayImage.appendChild(div);
					}

					var point = this.getProjection().fromLatLngToDivPixel(this.position);

					if (point) {
						div.style.left = (point.x - this.markerWidth/2) + 'px';
						div.style.top = (point.y - this.markerHeight/2) + 'px';
					}
				}

				getPosition() {
					return this.position;
				}

				remove() {
					this.setMap(null);
					if (this.div) {
						this.div.parentNode.removeChild(this.div);
						this.div = null;
					}
				}

			}

		}
		return new CustomMarker(opts);
	}


	// @pos: { lat: float, lng: float }
	geocodePosition(pos) {
	   	this.geocoder.geocode({
			latLng: pos
		}, (results, status) => {
			if (status == google.maps.GeocoderStatus.OK) {
				this.map.address( results[0].formatted_address )
			} else {
				app.flash.Warn('Oh Dear', 'We had a problem determining the address at this location.');
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
