// require.js looks for the following global when initializing
var require = {
	baseUrl: ".",
	paths: {
		"bindings-ladda":       		"bindings/ladda",
		"bindings-image-uploader": 		"bindings/image-uploader",
		"bluebird":             		"bower_modules/bluebird/js/browser/bluebird.min",
		"bootstrap":            		"bower_modules/components-bootstrap/js/bootstrap.min",
		"crossroads":           		"bower_modules/crossroads/dist/crossroads.min",
		"errorHelper":          		"helpers/errorHelper",
		"eventemitter2":        		"bower_modules/eventemitter2/lib/eventemitter2",
		"extenders-trackChanges":       "extenders/trackChanges",
		"flash":                		"helpers/flash",
		"google-maps":          		"bower_modules/google-maps/lib/Google.min",
		"hasher":               		"bower_modules/hasher/dist/js/hasher.min",
		"installationModel":    		"models/installationModel",
		"jquery":               		"bower_modules/jquery/dist/jquery.min",
		"knockout":             		"bower_modules/knockout/dist/knockout",
		"knockout-mapping":     		"bower_modules/knockout-mapping/knockout.mapping",
		"knockout-postbox":     		"bower_modules/knockout-postbox/build/knockout-postbox.min",
		"knockout-projections": 		"bower_modules/knockout-projections/dist/knockout-projections",
		"knockout-punches":     		"bower_modules/knockout.punches/knockout.punches.min",
		"ladda":                		"bower_modules/ladda/dist/ladda.min",
		"lodash":               		"bower_modules/lodash/dist/lodash.min",
		"loggedInUserModel":    		"models/loggedInUserModel",
		"modalHelper":     				"helpers/modal",
		"moment":               		"bower_modules/moment/min/moment.min",
		"signals":              		"bower_modules/js-signals/dist/signals.min",
		"spin":                 		"bower_modules/ladda/dist/spin.min",
		"text":                 		"bower_modules/requirejs-text/text",
		"toastr":               		"bower_modules/toastr/toastr",
		"validationHelper":     		"helpers/validation",
		"validator":            		"bower_modules/validator-js/validator.min",
		"weddingPartyModel": 		   	"models/weddingPartyModel",
		"weddingPartyGroupsModel":    	"models/weddingPartyGroupsModel",
		"weddingPartyPeopleModel":    	"models/weddingPartyPeopleModel"
	},
	shim: {
		"bootstrap": { deps: ["jquery"] },
		"rustique": { deps: ["toastr"] }
	}
};
