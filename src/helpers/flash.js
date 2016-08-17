import * as toastr from 'toastr';
import ko from 'knockout';

class Flash {

    constructor(app) {
        this.app = app;
        this.toasterOpts = {
            closeButton: false,
            debug: false,
            newestOnTop: true,
            progressBar: false,
            positionClass: "toast-top-right",
            preventDuplicates: false,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: 4000,
            extendedTimeOut: 0,
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            tapToDismiss: true
        }
    }

    // Will display a message to the user - a type can be passed in options
    // valid "type"'s' are 'error', 'warning', 'success' and 'info'
    Info(title='', msg='', inOpts={}) {
        console.assert(["undefined","object"].indexOf(typeof inOpts) > -1);
        toastr.info.apply(this, this.prepareOpts(title,msg,inOpts));
    }

    // Convenience wrapper for FlashMessage with type set to warning
    Warn(title='', msg='', inOpts={}) {
        console.assert(["undefined","object"].indexOf(typeof inOpts) > -1);
        toastr.warning.apply(this, this.prepareOpts(title,msg,inOpts));
    }

    // Convenience wrapper for FlashMessage with type set to error
    Success(title='', msg='', inOpts={}) {
        console.assert(["undefined","object"].indexOf(typeof inOpts) > -1);
        toastr.success.apply(this, this.prepareOpts(title,msg,inOpts));
    }

    // Convenience wrapper for FlashMessage with type set to error
    Error(title='', msg='', inOpts={}) {
        console.assert(["undefined","object"].indexOf(typeof inOpts) > -1);
        toastr.error.apply(this, this.prepareOpts(title,msg,inOpts));
    }

    prepareOpts(title,msg,inOpts) {
        var title = ko.unwrap(title),
            msg = ko.unwrap(msg),
            inOpts = ko.unwrap(inOpts);

        if ( typeof msg === 'object' ) {
            inOpts = msg;
            msg = '';
        }
        var opts = this.toasterOpts;
        var uniqueClassName = `undo-link-${Date.now()}`;
        if ( inOpts.timer != null ) {
            opts.timeOut = inOpts.timer;
        }
        if ( inOpts.undo != null ) {
            if ( opts.timeOut < 5000 ) {
                opts.timeOut = 5000;
            }
            app.flash.undoAction = inOpts.undo;
            msg = `${msg} <a href='javascript:;' onclick='app.flash.undoAction()' class='${uniqueClassName}' style='color: white; font-weight: strong;'>undo</a>`;
        }
        toastr.options = opts;

        if ( title !== '' && msg !== '' ) {
            return [msg,title];
        } else if ( title !== '' && msg === '' ) {
            return [title];
        } else {
            return [msg];
        }
    }
}

export default Flash;