import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections'
import 'knockout-punches'
import app from './rustique';
import navBar from 'components/nav-bar/nav-bar';
import pageHome from 'components/page-home/home';
import sectionIntro from 'components/section-intro/section-intro';
import sectionWeddingParty from 'components/section-wedding-party/section-wedding-party';
import sectionMaps from 'components/section-maps/section-maps';
import sectionRsvp from 'components/section-rsvp/section-rsvp';
import adminPanel from 'components/admin-panel/admin-panel';
import overlayEditIntro from 'components/overlay-edit-intro/overlay-edit-intro';
import overlayEditWeddingParty from 'components/overlay-edit-weddingparty/overlay-edit-weddingparty';
import overlayEditMaps from 'components/overlay-edit-maps/overlay-edit-maps';
import widgetMap from 'components/widget-map/widget-map';
import modalConfirm from 'components/modal-confirm/modal-confirm';
import overlayEditRsvp from 'components/overlay-edit-rsvp/overlay-edit-rsvp';
import pageLogin from 'components/page-login/page-login';
import page404 from 'components/page-404/page-404';
import widgetTextEditor from 'components/widget-text-editor/widget-text-editor';
import pageForgotPassword from 'components/page-forgot-password/page-forgot-password';
import pageResetPassword from 'components/page-reset-password/page-reset-password';
import pageError from 'components/page-error/page-error';
import widgetToggleSwitch from 'components/widget-toggle-switch/widget-toggle-switch';
import widgetImageEditor from 'components/widget-image-editor/widget-image-editor';
import modalUploadImage from 'components/modal-upload-image/modal-upload-image';


// Components can be packaged as AMD modules, such as the following:
ko.components.register('nav-bar', { viewModel: navBar.viewModel, template: navBar.template });
ko.components.register('page-home', { viewModel: pageHome.viewModel, template: pageHome.template });
ko.components.register('section-intro', { viewModel: sectionIntro.viewModel, template: sectionIntro.template });
ko.components.register('section-wedding-party', { viewModel: sectionWeddingParty.viewModel, template: sectionWeddingParty.template });
ko.components.register('section-maps', { viewModel: sectionMaps.viewModel, template: sectionMaps.template });
ko.components.register('section-rsvp', { viewModel: sectionRsvp.viewModel, template: sectionRsvp.template });
ko.components.register('admin-panel', { viewModel: adminPanel.viewModel, template: adminPanel.template });
ko.components.register('overlay-edit-intro', { viewModel: overlayEditIntro.viewModel, template: overlayEditIntro.template });
ko.components.register('overlay-edit-weddingparty', { viewModel: overlayEditWeddingParty.viewModel, template: overlayEditWeddingParty.template });
ko.components.register('overlay-edit-maps', { viewModel: overlayEditMaps.viewModel, template: overlayEditMaps.template });
ko.components.register('widget-map', { viewModel: widgetMap.viewModel, template: widgetMap.template });
ko.components.register('modal-confirm', { viewModel: modalConfirm.viewModel, template: modalConfirm.template });
ko.components.register('overlay-edit-rsvp', { viewModel: overlayEditRsvp.viewModel, template: overlayEditRsvp.template });
ko.components.register('page-login', { viewModel: pageLogin.viewModel, template: pageLogin.template });
ko.components.register('page-404', { viewModel: page404.viewModel, template: page404.template });
ko.components.register('widget-text-editor', { viewModel: widgetTextEditor.viewModel, template: widgetTextEditor.template });
ko.components.register('page-forgot-password', { viewModel: pageForgotPassword.viewModel, template: pageForgotPassword.template });
ko.components.register('page-reset-password', { viewModel: pageResetPassword.viewModel, template: pageResetPassword.template });
ko.components.register('page-error', { viewModel: pageError.viewModel, template: pageError.template });
ko.components.register('widget-toggle-switch', { viewModel: widgetToggleSwitch.viewModel, template: widgetToggleSwitch.template });
ko.components.register('widget-image-editor', { viewModel: widgetImageEditor.viewModel, template: widgetImageEditor.template });
ko.components.register('modal-upload-image', { viewModel: modalUploadImage.viewModel, template: modalUploadImage.template });
// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

window.app = new app();

// Start the application
ko.punches.enableAll();
ko.applyBindings({ route: window.app.router.currentRoute });
