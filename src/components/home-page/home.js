import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
    constructor(route) {
        this.installation = app.installation;
    }
}

export default { viewModel: HomeViewModel, template: homeTemplate };