import ko from 'knockout';
import templateMarkup from 'text!./admin-header.html';

class AdminHeader {
	constructor(params) {
		this.subscriptions = [];
	}

	OnClickToggleSidebar() {
		if ( app.sidebarPosition() === 'open' ) {
			app.hideOverlay();
			app.sidebarPosition( 'closed' );
		} else {
			app.sidebarPosition( 'open' )
		}
	}

	OnClickHelp() {
		console.log('help');
	}

	OnClickLogOut() {
		app.Logout(true);
	}

	dispose() {
		for ( var sub of this.subscriptions ) {
			sub.dispose();
		}
	}
}

export default { viewModel: AdminHeader, template: templateMarkup };
