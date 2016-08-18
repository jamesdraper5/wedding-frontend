import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
    constructor(route) {
        this.installation = app.installation;
        this.showAdmin = ko.observable(route.showAdmin || false);

        //console.log('route', route);
    }
}

export default { viewModel: HomeViewModel, template: homeTemplate };
