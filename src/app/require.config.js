// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads":           "bower_modules/crossroads/dist/crossroads.min",
        "google-maps":          "bower_modules/google-maps/lib/Google.min",
        "hasher":               "bower_modules/hasher/dist/js/hasher.min",
        "installationModel":    "models/installationModel",
        "jquery":               "bower_modules/jquery/dist/jquery",
        "knockout":             "bower_modules/knockout/dist/knockout",
        "knockout-mapping":     "bower_modules/knockout-mapping/knockout.mapping",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "knockout-punches":     "bower_modules/knockout.punches/knockout.punches.min",
        "signals":              "bower_modules/js-signals/dist/signals.min",
        "text":                 "bower_modules/requirejs-text/text"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
