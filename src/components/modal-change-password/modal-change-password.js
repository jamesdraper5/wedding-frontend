import ko from 'knockout';
import templateMarkup from 'text!./modal-change-password.html';
import Raven from 'raven';

class ModalChangePassword {
	constructor(params) {
		this.callback = params.callback;


		this.uid = Date.now();

		this.currentPassword = ko.observable('');
   		this.newPassword = ko.observable('');
   		this.newPasswordConfirm = ko.observable('');

		this.isSubmitting = ko.observable(false);

		// Subscriptions
		this.subscriptions = [];
		this.subscriptions.push( this.btnText = ko.pureComputed(() => {
			if ( this.isSubmitting() ) {
				return 'Updating...'
			} else {
				return 'Update'
			}
		}))

		app.modal.Init('UpdatePassword', this, params)
	}


	/******************************
	* Event Handlers
	******************************/

	OnClickCancel() {
		this.Close()
	}

	OnSubmit() {

		this.Close();

	}


	/******************************
	* Workers
	******************************/




	/******************************
	* UI
	******************************/




	Close() {
		app.modal.Close(this, false);
	}

	dispose() {
		this.subscriptions.forEach((sub) => sub.dispose())
	}
}

export default { viewModel: ModalChangePassword, template: templateMarkup };
