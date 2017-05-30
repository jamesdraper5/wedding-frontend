import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections'
import 'knockout-punches'
import app from './app';
import navBar from 'components/nav-bar/nav-bar';
import pageHome from 'components/page-home/home';
import sectionHome from 'components/section-home/section-home';
import sectionIntro from 'components/section-intro/section-intro';
import sectionWeddingParty from 'components/section-wedding-party/section-wedding-party';
import sectionMaps from 'components/section-maps/section-maps';
import sectionRsvp from 'components/section-rsvp/section-rsvp';
import sectionTravel from 'components/section-travel/section-travel';
import adminHeader from 'components/admin-header/admin-header';
import adminPanel from 'components/admin-panel/admin-panel';
import overlayEditHome from 'components/overlay-editor-home/overlay-editor-home';
import overlayEditIntro from 'components/overlay-editor-intro/overlay-editor-intro';
import overlayEditWeddingParty from 'components/overlay-editor-weddingparty/overlay-editor-weddingparty';
import overlayEditMaps from 'components/overlay-editor-maps/overlay-editor-maps';
import overlaySettingsAccount from 'components/overlay-settings-account/overlay-settings-account';
import overlaySettingsGeneral from 'components/overlay-settings-general/overlay-settings-general';
import widgetMap from 'components/widget-map/widget-map';
import modalConfirm from 'components/modal-confirm/modal-confirm';
import overlayEditRsvp from 'components/overlay-editor-rsvp/overlay-editor-rsvp';
import pageLogin from 'components/page-login/page-login';
import page404 from 'components/page-404/page-404';
import widgetTextEditor from 'components/widget-text-editor/widget-text-editor';
import pageForgotPassword from 'components/page-forgot-password/page-forgot-password';
import pageResetPassword from 'components/page-reset-password/page-reset-password';
import pageError from 'components/page-error/page-error';
import widgetToggleSwitch from 'components/widget-toggle-switch/widget-toggle-switch';
import widgetImageEditor from 'components/widget-image-editor/widget-image-editor';
import modalImagePicker from 'components/modal-image-picker/modal-image-picker';
import modalUploadImage from 'components/modal-upload-image/modal-upload-image';
import modalChangePassword from 'components/modal-change-password/modal-change-password';


// Components can be packaged as AMD modules, such as the following:
ko.components.register('nav-bar', { viewModel: navBar.viewModel, template: navBar.template });
ko.components.register('page-home', { viewModel: pageHome.viewModel, template: pageHome.template });
ko.components.register('section-home', { viewModel: sectionHome.viewModel, template: sectionHome.template });
ko.components.register('section-intro', { viewModel: sectionIntro.viewModel, template: sectionIntro.template });
ko.components.register('section-wedding-party', { viewModel: sectionWeddingParty.viewModel, template: sectionWeddingParty.template });
ko.components.register('section-maps', { viewModel: sectionMaps.viewModel, template: sectionMaps.template });
ko.components.register('section-rsvp', { viewModel: sectionRsvp.viewModel, template: sectionRsvp.template });
ko.components.register('section-travel', { viewModel: sectionTravel.viewModel, template: sectionTravel.template });
ko.components.register('admin-header', { viewModel: adminHeader.viewModel, template: adminHeader.template });
ko.components.register('admin-panel', { viewModel: adminPanel.viewModel, template: adminPanel.template });
ko.components.register('overlay-editor-home', { viewModel: overlayEditHome.viewModel, template: overlayEditHome.template });
ko.components.register('overlay-editor-intro', { viewModel: overlayEditIntro.viewModel, template: overlayEditIntro.template });
ko.components.register('overlay-editor-weddingparty', { viewModel: overlayEditWeddingParty.viewModel, template: overlayEditWeddingParty.template });
ko.components.register('overlay-editor-maps', { viewModel: overlayEditMaps.viewModel, template: overlayEditMaps.template });
ko.components.register('overlay-settings-general', { viewModel: overlaySettingsGeneral.viewModel, template: overlaySettingsGeneral.template });
ko.components.register('overlay-settings-account', { viewModel: overlaySettingsAccount.viewModel, template: overlaySettingsAccount.template });
ko.components.register('widget-map', { viewModel: widgetMap.viewModel, template: widgetMap.template });
ko.components.register('modal-confirm', { viewModel: modalConfirm.viewModel, template: modalConfirm.template });
ko.components.register('overlay-editor-rsvp', { viewModel: overlayEditRsvp.viewModel, template: overlayEditRsvp.template });
ko.components.register('page-login', { viewModel: pageLogin.viewModel, template: pageLogin.template });
ko.components.register('page-404', { viewModel: page404.viewModel, template: page404.template });
ko.components.register('widget-text-editor', { viewModel: widgetTextEditor.viewModel, template: widgetTextEditor.template });
ko.components.register('page-forgot-password', { viewModel: pageForgotPassword.viewModel, template: pageForgotPassword.template });
ko.components.register('page-reset-password', { viewModel: pageResetPassword.viewModel, template: pageResetPassword.template });
ko.components.register('page-error', { viewModel: pageError.viewModel, template: pageError.template });
ko.components.register('widget-toggle-switch', { viewModel: widgetToggleSwitch.viewModel, template: widgetToggleSwitch.template });
ko.components.register('widget-image-editor', { viewModel: widgetImageEditor.viewModel, template: widgetImageEditor.template });
ko.components.register('modal-image-picker', { viewModel: modalImagePicker.viewModel, template: modalImagePicker.template });
ko.components.register('modal-upload-image', { viewModel: modalUploadImage.viewModel, template: modalUploadImage.template });
ko.components.register('modal-change-password', { viewModel: modalChangePassword.viewModel, template: modalChangePassword.template });
// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

window.app = new app();

// Start the application
ko.punches.enableAll();
ko.applyBindings({ route: window.app.router.currentRoute });
