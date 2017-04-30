import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import PersonModel from './weddingPartyPersonModel';


class WeddingPartyGroupModel {
	constructor(data) {
		this.UpdateData(data);
		this.subscriptions = [];

		this.trackAllChanges();
		this.isDirty = ko.computed(() => {
		    for (var key in this) {

		        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) && typeof this[key].isDirty === 'function' && this[key].isDirty()) {
		            return true;
		        } else if ( key === 'people' ) {
		        	for ( var person of this[key]() ) {
	        			if ( person.isDirty() ) {
	        				return true;
	        			}
	        		}
		        }
		    }
		    return false;
		});

		// Tell the weddingPartyModel that this group has changed.
		this.isDirty.subscribe((n) => {
			ko.postbox.publish('group-changed',  {});
		});

		// The weddingPartyPersonModel sends this event to let us know that one of the people in the array has had their details updated.
		// We can then use this to trigger the isDirty computed to update
		ko.postbox.subscribe('person-changed',  () => {
			this.people.valueHasMutated();
		});

		this.navTitle = ko.pureComputed(() => {
			return this.title().split(" ")[0] + Date.now();
		});


	}

	UpdateData(data) {
		mapping.fromJS(data, WeddingPartyGroupModel.mapping, this);
	}

	removePerson(person) {
		var idx = app.utility.FindIndexByKeyValue(this.people(), 'id', person.id());
		if ( idx > -1 ) {
			this.people.splice(idx, 1);
		}
	}

	Save(showMessage=false) {
		var method = 'put';
		var url = `weddingParties/${this.id}`;
		var partyData = {

		};

		if ( this.id ==  0 ) {
			method = 'post'
			url = 'weddingParties';
		}

		app.api[method](url, partyData).then((result) => {
			if ( showMessage ) {
				app.flash.Success("Wedding Party Saved");
			}
		});
	}

	trackAllChanges() {
	    for (var key in this) {
	        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) ) {
		        if ( key !== 'people' ) {
		        	this[key].extend({ trackChanges: true });
		        }
		    }
	    }
	}
}

WeddingPartyGroupModel.mapping = {
	'people': {
        create: (options) => {
			return new PersonModel(options.data)
        }
    }
}


export default WeddingPartyGroupModel;
