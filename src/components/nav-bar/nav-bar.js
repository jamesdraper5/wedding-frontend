import ko from 'knockout';
import template from 'text!./nav-bar.html';

class NavBarViewModel {
    constructor(params) {
        this.route = params.route;
        this.installation = app.installation;
    }

}

export default { viewModel: NavBarViewModel, template: template };