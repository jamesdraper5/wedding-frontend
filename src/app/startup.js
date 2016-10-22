import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections'
import 'knockout-punches'
import * as app from './rustique';

// Components can be packaged as AMD modules, such as the following:
ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
ko.components.register('page-home', { require: 'components/page-home/home' });
ko.components.register('section-intro', { require: 'components/section-intro/section-intro' });
ko.components.register('section-wedding-party', { require: 'components/section-wedding-party/section-wedding-party' });
ko.components.register('section-maps', { require: 'components/section-maps/section-maps' });
ko.components.register('section-rsvp', { require: 'components/section-rsvp/section-rsvp' });
ko.components.register('admin-panel', { require: 'components/admin-panel/admin-panel' });
ko.components.register('overlay-edit-intro', { require: 'components/overlay-edit-intro/overlay-edit-intro' });
ko.components.register('overlay-edit-wedding-party', { require: 'components/overlay-edit-wedding-party/overlay-edit-wedding-party' });
ko.components.register('overlay-edit-maps', { require: 'components/overlay-edit-maps/overlay-edit-maps' });
ko.components.register('widget-map', { require: 'components/widget-map/widget-map' });
ko.components.register('modal-confirm', { require: 'components/modal-confirm/modal-confirm' });
ko.components.register('overlay-edit-rsvp', { require: 'components/overlay-edit-rsvp/overlay-edit-rsvp' });
ko.components.register('page-login', { require: 'components/page-login/page-login' });
// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

window.app = new app();

// Start the application
ko.punches.enableAll();
ko.applyBindings({ route: window.app.router.currentRoute });
