import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import * as PersonModel from './weddingPartyPersonModel';


class WeddingPartyGroupModel {
	constructor(data) {
		this.UpdateData(data);

		this.trackAllChanges();
		this.isDirty = ko.computed(() => {
		    for (var key in this) {
		        if (this.hasOwnProperty(key) && ko.isObservable(this[key]) && typeof this[key].isDirty === 'function' && this[key].isDirty()) {
		            return true;
		        }
		    }
		});

	}

	UpdateData(data) {
		mapping.fromJS(data, WeddingPartyGroupModel.mapping, this);
	}

	removePerson(person) {
		alert('TO DO!!');
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
	            this[key].extend({ trackChanges: true });
	        }
	    }
	}
}

WeddingPartyGroupModel.mapping = {
	'people': {
        create: (options) => {
			return new PersonModel(options.data) //);
        }
    }
}


export default WeddingPartyGroupModel;
