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

    }

    OnRendered() {
		GoogleMapsLoader.load((google) => {
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
    		console.log('doing edit stuff');
	    	google.maps.event.addListener(this.googleMarker, 'dragend', () => {
	    		this.geocodePosition(this.googleMarker.getPosition());
	    	});

	    	this.subscriptions.push( this.map.title.subscribe((title) => {
	    		this.googleMarker.setTitle(title)
	    	}));
    	}

    	// To add the marker to the map, call setMap();
    	this.googleMarker.setMap(this.googleMap)
    }

	geocodePosition(pos) {
	   var geocoder = new google.maps.Geocoder();
	   geocoder.geocode({
	        latLng: pos
	    }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                this.map.latitude( pos.lat() )
                this.map.latitude( pos.lng() )
                this.map.title( results[0].formatted_address )

            } else {
            	// Not sure if we need an error message for this, could probably just fail silently...
                //app.flash.Error( "<strong>Sorry!</strong> ", 'Cannot determine address at this location.' );
            }
	    });
	}

	setInitialLocation() {
		console.log('this', this);
		console.log('this.isEditMode', this.isEditMode);
		if ( !this.isEditMode ) return;

		console.log('doing edit stuff 2');
		// The inital location is set to Times Square in the DB.
		// If it hasn't been edited then ask user for their current location to set map marker, else return
		if ( this.map.latitude() !== '40.7505' && this.map.longitude() !== '-73.9934' ) {
			return;
		}
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.moveMarker( position.coords.latitude, position.coords.longitude )
			});
		}
	}

	moveMarker( lat, lng ) {
		this.googleMap.panTo( new google.maps.LatLng( lat, lng ) );
		this.googleMarker.setPosition( new google.maps.LatLng( lat, lng ) );
		this.map.latitude( lat );
		this.map.latitude( lng );
	};

	dispose() {
	    this.subscriptions.forEach((sub) => {
	        sub.dispose()
	    })
	}
}

export default { viewModel: WidgetMap, template: templateMarkup };
