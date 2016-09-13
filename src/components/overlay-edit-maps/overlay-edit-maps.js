import ko from 'knockout';
import templateMarkup from 'text!./overlay-edit-maps.html';
import * as GoogleMapsLoader from 'google-maps';

class OverlayEditMaps {
    constructor(params) {
    	this.title = app.installation.sections.maps.menuText;
    	this.maps = app.installation.sections.maps.locations;

    	this.isSubmitting = ko.observable(false);
    	this.btnText = ko.pureComputed(() => {
    	    if ( this.isSubmitting() ) {
    	        return 'Saving';
    	    } else {
    	        return 'Save';
    	    }
    	});

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
    	console.log('OnRendered');
    	var self = this;
    	GoogleMapsLoader.load(function(google) {
    		self.createMaps(google);
    	});
    }

    createMaps(google) {
    	for ( var map of this.maps() ) {
    		var el = document.getElementById('edit-map' + map.id());
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

    OnSubmit() {
    	this.isSubmitting(true);
    	var introData = {
    		header: this.title(),
    		content: this.content(),
    		menuText: this.menuText()
    	};
    	app.api.put(`api/intros/${this.id}`, introData).then((result) => {
    		this.Close();
    	}).finally(() => {
    		this.isSubmitting(false);
    	});
    }

    Close() {
        app.overlayToShow(null);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: OverlayEditMaps, template: templateMarkup };
