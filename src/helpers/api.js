/*
Note on 'APIResult.id'.
When method is "post", we return the parsed id from the header if possible.
This allows us to access APIResult.id which is typically what we need from a post request.
*/

import * as GoogleMapsLoader from 'google-maps';
import * as $ from 'jquery';
import EventEmitter2 from 'eventemitter2';
import * as moment from 'moment';
import * as Promise from 'bluebird';

class Api extends EventEmitter2 {

    constructor() {
        super();
        /*
        if ( !window.devMode ) {
            Promise.onPossiblyUnhandledRejection((e, promise) => {
                if e.httpRequestOptions?
                    Raven.captureMessage 'XHR failed',
                        extra:
                            httpRequestOptions: e.httpRequestOptions
                            status: e.status
                            response: if e.responseJSON? then e.responseJSON else e.responseText
                else
                    Raven.captureException e
                return #This prevents console alerts about unhandled
            });
        }
        */

    }

    request({url, method, data, inOpts}) {
        if ( method !== 'get' ) {
            data = JSON.stringify(data)
        }
        var opts = {
            url: url,
            data: data,
            method: method,
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json'
            },
            emitError: true
        }

        if ( inOpts != null ) {
            $.extend( opts, inOpts )
        }

        var xhr = $.ajax(opts);

        return Promise.resolve(xhr).then((response) => {
            var id = 0;
            if ( method === 'post' ) {
                id = parseInt(xhr.getResponseHeader('id'), 10)
            }
            return {
                response:response,
                xhr:xhr,
                id:id
            }
        }, (error) => {
            error.httpRequestOptions = opts;
            if ( opts.emitError ) {
                this.emit('error', error);
            }
            return error;
        });

    }

    get(url, data, opts) {
        return this.request({
            url: url,
            data: data,
            method: 'get',
            inOpts: opts
        })
    }

    put(url, data, opts) {
        return this.request({
            url: url,
            data: data,
            method: 'put',
            inOpts: opts
        })
    }

    post(url, data, opts) {
        return this.request({
            url: url,
            data: data,
            method: 'post',
            inOpts: opts
        })
    }

    delete(url, data, opts) {
        return this.request({
            url: url,
            data: data,
            method: 'delete',
            inOpts: opts
        })
    }

}

export default new Api();
