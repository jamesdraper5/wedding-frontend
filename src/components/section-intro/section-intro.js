import ko from 'knockout';
import templateMarkup from 'text!./section-intro.html';

class IntroSection {
    constructor(params) {
    	this.intro = app.installation.sections.intro;
    	this.signature = app.installation.name;
    	console.log('this.intro', this.intro);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: IntroSection, template: templateMarkup };
