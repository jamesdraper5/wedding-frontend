import ko from 'knockout';
import templateMarkup from 'text!./admin-panel.html';

class AdminPanel {
    constructor(params) {
        this.message = ko.observable('Hello from the admin-panel component!');
    }

    OnClickEditIntro() {
    	console.log('app.installation.sections.intro', app.installation.sections.intro);
    	var introData = {
    		id: ko.unwrap(app.installation.sections.intro.id),
    		title: ko.unwrap(app.installation.sections.intro.header),
    		content: ko.unwrap(app.installation.sections.intro.content),
    		linkText: ko.unwrap(app.installation.sections.intro.linkText)
    	}
    	app.modal.Show('edit-intro', introData, this);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: AdminPanel, template: templateMarkup };
