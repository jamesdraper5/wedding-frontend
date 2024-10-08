import ko from 'knockout';
import * as mapping from 'knockout-mapping';

const weddingPartyPersonMapping = {
	'imageUrl': {
		create: (options) => {
			if ( options.data != null ) {
				return ko.observable( options.data );
			} else {
				return ko.observable( "images/bridesmaid-bw.jpg" );
			}
		}
	}
}

const nonTrackableKeys = ['isEditing'];

class WeddingPartyPersonModel {
	constructor(data) {

		this.UpdateData(data);
		this.isEditing = ko.observable(false);
		this.trackAllChanges();

		this.isDirty = ko.computed(() => {
		    for (var key in this) {
		        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) && typeof this[key].isDirty === 'function' && this[key].isDirty() && nonTrackableKeys.indexOf(key) === -1) {
		            return true;
		        }
		    }
		    return false;
		});

		this.isDirty.subscribe((n) => {
			ko.postbox.publish('person-changed',  {});
		});

	}

	UpdateData(data) {
		mapping.fromJS(data, weddingPartyPersonMapping, this);
	}

	ToggleEdit() {
		this.isEditing( !this.isEditing() );
	}

	Save(showMessage=false) {
		var method = 'put';
		var url = `weddingPartyPeople/${this.id}`;
		var partyData = {

		};

		if ( this.id ==  0 ) {
			method = 'post'
			url = 'weddingPartyPeople';
		}

		app.api[method](url, partyData).then((result) => {
			if ( showMessage ) {
				app.flash.Success("Person Saved");
			}
		});
	}

	trackAllChanges() {
	    for (var key in this) {
	        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) ) {
	            this[key].extend({ trackChanges: true });
	        }
	    }
	}
}

export default WeddingPartyPersonModel;
