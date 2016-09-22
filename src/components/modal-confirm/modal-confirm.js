import ko from 'knockout';
import templateMarkup from 'text!./modal-confirm.html';

class ModalConfirm {
	constructor(params) {
		this.title = params.title || 'Are You Sure?'
		this.question = params.question
		this.callback = params.callback
		this.showCancel = (params.showCancel == null) ? true : params.showCancel;

		app.modal.Init('Confirm', this, params)

	}

	OnShow() {
	    $("#modalConfirmBtn").focus()
	}

	OnClickCancel() {
	    this.Close()
	}

	OnClickConfirm() {
	    this.Close()

	    if ( this.callback != null ) {
	        this.callback()
	    }
	}

	Close() {
		app.modal.Close(this, false);
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
	}
}

export default { viewModel: ModalConfirm, template: templateMarkup };
