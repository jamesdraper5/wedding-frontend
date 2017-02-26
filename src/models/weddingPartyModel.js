import ko from 'knockout';
import * as mapping from 'knockout-mapping';
import GroupModel from './weddingPartyGroupModel';


class WeddingPartyModel {
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

		//console.log('party model - data', data);
		this.navTitle = ko.pureComputed(() => {
			return this.title().split(" ")[0] + Date.now();
		})

	}

	UpdateData(data) {
		mapping.fromJS(data, WeddingPartyModel.mapping, this);
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
	            this[key].extend({ trackChanges: true });
	        }
	    }
	}
}

WeddingPartyModel.mapping = {
	'groups': {
        create: (options) => {
			return new GroupModel(options.data)
        }
    }
}


export default WeddingPartyModel;
