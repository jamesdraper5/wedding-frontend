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
			if ( app.isUserLoggedIn() ) {
				className += 'logged-in ';
			}
			className += app.sidebarPosition();
			return className;
		});

		$(window).on('scroll', () => {
			this.updateNav()
		});

	}

	// add class for making the nav bar BG solid when scrolled
	updateNav() {
		if ( $('body').scrollTop() >= 100 ) {
			$('#main-nav').addClass('solid-bg');
		} else {
			$('#main-nav').removeClass('solid-bg');
		}
	}

	OnClickNavItem(item) {
		var navHeight = $('#main-nav').height();
		var $section = $( this.getSectionId(item) );
		$.scrollTo( $section, 600, { offset: -navHeight } )
	}

	OnClickFAQ() {
		if ( app.constants.TRUSTEDSITES.indexOf(app.installation.id()) === -1 ) {
			console.log('nnnn');
			return;
		}
		var navHeight = $('#main-nav').height();
		var $section = '#faqs-container';
		$.scrollTo( $section, 600, { offset: -navHeight } )
	}

	getSectionId(item) {
		return '#' + item.toLowerCase().split(' ').join('-') + '-container'; // e.g. #wedding-party-container
	}

}

export default { viewModel: NavBarViewModel, template: template };
