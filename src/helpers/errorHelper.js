import FlashHelper from './flash';
import * as _ from 'lodash';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

class ErrorHelper {

	constructor() {

		// Some messages to save us having them everywhere in code
		this.messages = {
			accessDenied: "Access Denied",
			accessDeniedDetail: "The server has denied you access. If this seems unusual, try logging out and back in again.",
			notFound: "Not Found",
			notFoundDetail: "Sorry, either that resource does not exist or you do not have permission to access it.",
			networkTimeout: "Network Timeout",
			networkTimeoutDetail: "Please check your internet connection and try again. Email hello@weddingpixie.com if you still have problems.",
			serverRejected: "Server Rejected",
			serverRejectedDetail: "Sorry the server rejected this request.",
			serverRejectedWithMessage: "The server rejected this request with the message:",
			serverError: "Server Error",
			serverErrorDetail: "Sorry the server ran into a problem processing this request. Please bear with us while we squish this little bug.",
			rateLimit: "Rate Limit Reached",
			rateLimitDetail: "Sorry, you have made the maximum number of requests in the current time frame. Please try again in 15 minutes."
		}

		this.Ajax = __bind(this.Ajax, this);
	}

	// Use this if there was an error performing an action
	Ajax(xhr, inOpts) {
		var opts = {
			redirectIfAccessDenied: false
		}
		$.extend(opts, inOpts);

		var errorCodesToIgnore = xhr.httpRequestOptions.errorCodesToIgnore || [];
		var explOpts = ["Whoops!","Yikes!","Oi vey!","Oh no!","Oh Dear!","Daaamn!","Holy Smokes Batman!"];
		var expl = explOpts[Math.floor(explOpts.length*Math.random())];
		if ( xhr.status == 401 ) { // Expired session
			// TO DO: handle expired session
			if ( errorCodesToIgnore.indexOf(xhr.status) > -1 ) {
				return;
			}
		} else if ( xhr.status == 404 ) { // Not found
			if ( errorCodesToIgnore.indexOf(xhr.status) === -1 ) {
				app.flash.Error( this.messages.notFound, opts.custom404Text || this.messages.notFoundDetail );
			}
		} else if ( xhr.status == 403 ) { // Access Denied
			if ( errorCodesToIgnore.indexOf(xhr.status) === -1 ) {
				app.flash.Error( this.messages.accessDenied, ( xhr.statusText.toLowerCase() === 'access denied' ? this.messages.accessDeniedDetail : xhr.statusText ) );
			}
		} else if ( xhr.status == 400 ) { // Server rejected
			if ( xhr.responseJSON != null && xhr.responseJSON.message && xhr.responseJSON.message === 'Validation error' && xhr.responseJSON.data != null && _.isArray(xhr.responseJSON.data) ) {
				var validationMessages = [];
				for ( var err of xhr.responseJSON.data ) {
					if ( err.msg != null ) {
						validationMessages.push( err.msg );
					}
				}
				if ( validationMessages.length ) {
					var validationMsg = validationMessages[0].substring(0,1).toUpperCase() + validationMessages[0].substring(1,validationMessages[0].length);
					app.flash.Error( "<strong>"+expl+"</strong> ", validationMsg );
				} else {
					app.flash.Error( "<strong>"+expl+"</strong> ", this.messages.serverRejectedDetail );
				}
			} else if ( xhr.responseJSON != null && xhr.responseJSON.message ) {
				app.flash.Error( "<strong>"+expl+"</strong> ", xhr.responseJSON.message );
			} else {
				app.flash.Error( this.messages.serverRejected, this.messages.serverRejectedDetail );
			}
		} else if ( xhr.status == 429 ) { // Rate limit exceeded
			app.flash.Error( this.messages.rateLimit, this.messages.rateLimitDetail );
		} else if ( xhr.status == 0 ) { // Network timeout
			app.flash.Error( this.messages.networkTimeout, this.messages.networkTimeoutDetail );
		} else {
			if ( xhr.responseJSON != null && xhr.responseJSON.message ) {
				app.flash.Error( expl, xhr.responseJSON.message )
			} else {
				app.flash.Error( this.messages.serverError, this.messages.serverErrorDetail );
			}
		}

		/*
		if opts.redirect
			app.GoTo 'dashboard'
		*/

		return true;
	}

}

export default ErrorHelper;
