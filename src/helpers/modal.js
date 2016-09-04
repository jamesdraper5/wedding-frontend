// import 'jquery-ui'; this randomly throws errors for some reason
import ko from 'knockout';
import * as _ from 'lodash';
import $ from 'jquery';

class ModalHelper {

	constructor() {
		//$.bridget( 'draggabilly', Draggabilly );
	}

	Init(modalId, modalVM, params={}, readyToShow=true) {
		console.log('init');
		modalVM.templateLoaded = ko.observable(false);
		modalVM.modalDivId = modalId + params.modalId;
		modalVM.modalRef = params.modalRef;
		if ( modalVM.readyToShow == null ) {
			modalVM.readyToShow = ko.observable(readyToShow);
		}

		// Used to turn off fade-in/out effect class
		modalVM.allowFade = ko.observable(true);


		var ShowModal = (modalVM) => {
			modalVM.modalDiv.modal("show");
			app.currentModalVM = modalVM;

			/* TO DO: need to fix import of jQuery-ui 'draggable' for this to work
			// we want the modal to be draggable except if it's a fixed one
			if ( $('#'+modalVM.modalDivId).attr('class').indexOf('modal-fix') == -1 ) {
				$('#'+modalVM.modalDivId + ' .modal-dialog').draggable({
					handle: ".modal-header"
				});
			}
			*/

			// Setup the after-closing-animation function:
			AttachOnhide(modalVM);
		}

		var AttachOnhide = (modalVM) => {
			modalVM.modalDiv.on('hidden.bs.modal', (e) => {
				// Clear the binding - not having this causes madness
				$( modalVM.modalDiv ).unbind( 'hidden.bs.modal' )

				// Invoke close callback if set
				if ( modalVM.modalRef.params.onCloseCallback != null ) {
					modalVM.modalRef.params.onCloseCallback()
				}

				if ( modalVM.closeAllStack != null ) {
					app.currentModalVM = undefined;
				} else if ( modalVM.stackedOnModalVM == null ) {
					app.currentModalVM = undefined;
				// ..Otherwise restore the modal this was stacked on
				} else {
					ShowModal(modalVM.stackedOnModalVM);
				}

				// Remove the modal component from the DOM by removing it in app.modals
				app.modals.remove(modalVM.modalRef);
			});
		}

		var onModalTemplateLoaded = () => {
			modalVM.modalDiv = $('#'+modalVM.modalDivId);
			modalVM.modalDiv.on('shown.bs.modal', (e) => {
				// Clear the binding - not having this causes madness
				$(modalVM.modalDiv).unbind('shown.bs.modal');
				if ( modalVM.OnShow != null ) {
					modalVM.OnShow();
				}

			});

			// If no existing stack, just show the view model
			if ( app.currentModalVM == null ) {
				ShowModal(modalVM);
			}
			// Existing stack, need to hide existing modal and show ours
			else {
				// Here we drop the existing OnHide (hidden.bs.modal) handler,
				// and replace it with one that will have no animation..
				// Then once we've hidden the modal and shown the new one
				// we re-attach the original OnHide function - which is important

				// Clear the existing binding - not having this causes madness - Topper
				$(app.currentModalVM.modalDiv).unbind('hidden.bs.modal');

				// Create the new onHide ('hidden.bs.modal') handler
				app.currentModalVM.modalDiv.on('hidden.bs.modal', (e) => {
					// Clear the binding - not having this causes madness
					$(app.currentModalVM.modalDiv).unbind('hidden.bs.modal');

					// Tell the new modal that it is stacked on another so we can restore
					modalVM.stackedOnModalVM = app.currentModalVM;

					// Turn off the fade-in effect
					modalVM.allowFade(false);

					// Show the new modal
					ShowModal(modalVM);
				});

				// Turn off the fade-out effect
				app.currentModalVM.allowFade(false);
				// Hide the current modal
				app.currentModalVM.modalDiv.modal("hide");
			}
		}

		var subscription = modalVM.templateLoaded.subscribe((isTemplateLoaded) => {
			if ( isTemplateLoaded ) {
				onModalTemplateLoaded();
				// Remove this subscription
				subscription.dispose();
				subscription = undefined;
			}
		});

	}

	// Wrapper function for showing a modal
	Confirm(title, question, callback) {
		app.modal.Show("confirm", {
			title: title,
			question: question,
			callback: callback
		}, this);
	}

	// Loads a modal by adding it to the app.modals observable array
	// Also ensures a modal is not loaded twice
	Show(name, params={}, parentVM) {
		// Create something to hold this reference
		var ModalRef = (name, params) => {
			this.name = name;
			params.parentVM = parentVM;
			this.params = params;
			this.readyToShow = false;
			return this;
		}

		var modalRef = new ModalRef(name, params);

		// Setup the loaded callback - modals are expected to call this
		$.extend(params, {
			modalId: app.modals().length + 1,
			modalRef: modalRef
		});

		app.modals.push(modalRef);
	}

	SetOnCloseCallback(modalVM, fn) {
		modalVM.modalRef.params.onCloseCallback = fn;
	}

	Close(closingModalVM, runCallback = true) {
		if ( closingModalVM.modalRef.params.callback != null && runCallback ) {
			closingModalVM.modalRef.params.callback();
		}

		// Close it
		closingModalVM.modalDiv.modal("hide");
	}

	CloseAll() {
		$('.modal.in').modal('hide');
		$('.modal-backdrop').hide();
	}

}

export default ModalHelper;
