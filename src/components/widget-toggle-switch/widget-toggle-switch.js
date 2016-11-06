import ko from 'knockout';
import templateMarkup from 'text!./widget-toggle-switch.html';

class WidgetToggleSwitch {
    constructor(params) {
    	this.labelText = params.labelText || '';
    	this.value = params.value || ko.observable(false);
    	this.switchId = 'switch-' + Date.now();
    	this.className = params.className || '';
    	this.style = params.style || {};

    	console.assert( ko.isObservable(params.value) )
    	console.assert( typeof params.value() === 'boolean' )
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WidgetToggleSwitch, template: templateMarkup };
