// require.js looks for the following global when initializing
var require = {
	baseUrl: ".",
	paths: {
		"bindings-bot-checker":       	"bindings/bot-checker",
		"bindings-ladda":       		"bindings/ladda",
		"bindings-image-uploader": 		"bindings/image-uploader",
		"bindings-move-labels":       	"bindings/move-labels",
		"bluebird":             		"bower_modules/bluebird/js/browser/bluebird.min",
		"bootstrap":            		"bower_modules/components-bootstrap/js/bootstrap.min",
		"constants":                	"helpers/constants",
		"darkroom":           			"bower_modules/darkroom/build/darkroom",
		"darkroom-plugins":           	"helpers/darkroom/saveImage",
		"errorHelper":          		"helpers/errorHelper",
		"eventemitter2":        		"bower_modules/eventemitter2/lib/eventemitter2",
		"extenders-trackChanges":       "extenders/trackChanges",
		"fabric":               		"bower_modules/fabric/dist/fabric",
		"flash":                		"helpers/flash",
		"google-maps":          		"bower_modules/google-maps/lib/Google.min",
		"installationModel":    		"models/installationModel",
		"jquery-scrollTo":              "bower_modules/jquery.scrollTo/jquery.scrollTo",
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
		"page": 						"bower_modules/page/page",
		"quill": 						"libs/quill/quill.min",
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
		"rustique": { deps: ["toastr"] },
		"fabric": {
			exports: "fabric"
		},
		"darkroom": { deps: ["fabric"] },
		"darkroom-plugins": { deps: ["darkroom"] }
	}
};
