import ko from 'knockout';
import template from 'text!./nav-bar.html';

class NavBarViewModel {
	constructor(params) {
		this.route = params.route;
		this.installation = app.installation;

		this.navbarClass = ko.pureComputed(() => {
			var className = '';
			if ( app.overlayToShow() == null ) {
				className += 'navbar-fixed-top ';
			}
			className += app.sidebarPosition();
			return className;
		});

		$(window).on('scroll', () => {
			this.updateNav()
		});

	}

	updateNav() {
		if ( $('body').scrollTop() >= 100 ) {
			$('#main-nav').addClass('solid-bg');
		} else {
			$('#main-nav').removeClass('solid-bg');
		}
	}

	OnClickNavItem(item) {
		var navHeight = $('#main-nav').height();
		var sectionId = '#' + item.toLowerCase().split(' ').join('-') + '-container'; // e.g. #wedding-party-container
		$.scrollTo( $(sectionId), 600, { offset: -navHeight } )
	}

	OnClickToggleSidebar() {
		if ( app.sidebarPosition() === 'open' ) {
			app.sidebarPosition( 'closed' )
		} else {
			app.sidebarPosition( 'open' )
		}

	}
}

export default { viewModel: NavBarViewModel, template: template };
