// TO DO: turn this into proper exported ES6 module
(function() {
	'use strict';

	Darkroom.plugins['saveImage'] = Darkroom.Plugin.extend({

		defaults: {
			callback: function() {
				this.darkroom.selfDestroy();
			}
		},

		initialize: function InitializeDarkroomSavePlugin() {
			var buttonGroup = this.darkroom.toolbar.createButtonGroup();

			this.destroyButton = buttonGroup.createButton({
				image: 'save'
			});

			this.destroyButton.addEventListener('click', this.options.callback.bind(this));
		},
	});

})();
