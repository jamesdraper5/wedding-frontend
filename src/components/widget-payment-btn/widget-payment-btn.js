import ko from 'knockout';
import templateMarkup from 'text!./widget-payment-btn.html';

class WidgetPaymentBtn {
    constructor(params) {
        this.mode = params.mode; // 'payment' or 'update'. 'update' is just for changing card details
        this.btnText = params.btnText || 'Publish site';
        console.assert(['payment', 'update'].indexOf(this.mode) !== -1);
        this.isTokenLoaded = ko.observable(false);
        this.getPaymentToken();
        this.token = ko.observable(null);
        this.stripeId = ko.observable(null);
        this.paymentUrl = window.devMode ? 'http://www.wedding.dev/publish' : 'https://www.weddingpixie.com/publish';
    }

    getPaymentToken() {
        app.api.get('/api/authenticate/getpaymenttoken').then((result) => {
            this.token(result.response.data.token);
            this.isTokenLoaded(true);
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: WidgetPaymentBtn, template: templateMarkup };
