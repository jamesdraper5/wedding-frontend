import * as FlashHelper from './flash';
import * as _ from 'lodash';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

class ErrorHelper {

    constructor() {

        // Some messages to save us having them everywhere in code
        this.messages = {
            AccessDenied: "Access Denied",
            AccessDeniedDetail: "The server has denied you access. If this seems unusual, try logging out and back in again.",
            NotFound: "Not Found",
            NotFoundDetail: "Sorry, either that resource does not exist or you do not have permission to access it.",
            NetworkTimeout: "Network Timeout",
            NetworkTimeoutDetail: "Please check your internet connection and try again. Email support@XXXXX.com if you still have problems.",
            ServerRejected: "Server Rejected",
            ServerRejectedDetail: "Sorry the server rejected this request.",
            ServerRejectedWithMessage: "The server rejected this request with the message:",
            ServerError: "Server Error",
            ServerErrorDetail: "Sorry the server ran into a problem processing this request. Please bear with us while we squish this little bug."
        }

        this.Ajax = __bind(this.Ajax, this);
    }

    // Use this if there was an error performing an action
    Ajax(xhr, inOpts) {
        var opts = {
            redirectIfAccessDenied: false
        }
        $.extend(opts, inOpts);

        var explOpts = ["Whoops!","Yikes!","Oi vey!","Oh no!","Oh Dear!","Daaamn!","Holy Smokes Batman!"];
        var expl = explOpts[Math.floor(explOpts.length*Math.random())];
        if ( xhr.status == 401 ) { // Expired session
            if ( opts.redirectIfAccessDenied ) {
                console.warn('TO DO - redirect to login');
                //Lightbox.cancel()# Close all lightboxes
                //app.redirectToLogin()
            /*
            TO DO: build login modal??
            } else if ( !app.isShowingLoginModal() and app.currentRoute?().page? and app.currentRoute().page isnt 'login' ) {
                app.showLoginModal()
            */
            } else {
                return;
            }
        } else if ( xhr.status == 404 ) { // Not found
            app.flash.Error( this.messages.NotFound, opts.custom404Text || this.messages.NotFoundDetail );
        } else if ( xhr.status == 403 ) { // Access Denied
            app.flash.Error( this.messages.AccessDenied, ( xhr.statusText.toLowerCase() === 'access denied' ? this.messages.AccessDeniedDetail : xhr.statusText ) );
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
                    app.flash.Error( "<strong>"+expl+"</strong> ", this.messages.ServerRejectedDetail );
                }
            } else if ( xhr.responseJSON != null && xhr.responseJSON.message ) {
                app.flash.Error( "<strong>"+expl+"</strong> ", xhr.responseJSON.message );
            } else {
                app.flash.Error( this.messages.ServerRejected, this.messages.ServerRejectedDetail );
            }
        } else if ( xhr.status == 0 ) { // Network timeout
            app.flash.Error( this.messages.NetworkTimeout, this.messages.NetworkTimeoutDetail );
        } else {
            if ( xhr.responseJSON != null && xhr.responseJSON.message ) {
                app.flash.Error( expl, xhr.responseJSON.message )
            } else {
                app.flash.Error( this.messages.ServerError, this.messages.ServerErrorDetail );
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
