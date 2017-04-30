import ko from 'knockout';
import Quill from 'quill';
import templateMarkup from 'text!./widget-text-editor.html';

class WidgetTextEditor {
	constructor(params) {
		this.originalContent = ko.observable(ko.unwrap(params.content) || '');
		this.writeableContent = params.content || ko.observable('');
		this.labelText = params.labelText || '';
		this.editorId = 'quill' + Date.now();
		this.enable = params.enable || ko.observable(true);
		this.subscriptions = [];

		this.toolbarOpts = [
			[{ 'header': [1, 2, 3, false] }],
			['bold', 'italic', 'underline'],        // toggled buttons
			['blockquote'],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
			[{ 'align': [] }],
		];
	}

	OnRendered() {
		this.editor = new Quill('#'+this.editorId, {
			theme: 'snow',
			modules: {
				toolbar: this.toolbarOpts
			}
		});

		this.editor.enable( this.enable() )
		this.subscriptions.push(this.enable.subscribe(n => {
			this.editor.enable(n)
		}))
		this.editor.on('text-change', this.OnTextChange.bind(this))

	}

	OnTextChange(delta, oldDelta, source) {
		this.writeableContent( this.editor.root.innerHTML );
	}

	dispose() {
		// This runs when the component is torn down. Put here any logic necessary to clean up,
		// for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
		this.editor.off('text-change', this.OnTextChange)
		this.subscriptions.forEach(subscription => subscription.dispose())
	}
}

export default { viewModel: WidgetTextEditor, template: templateMarkup };
