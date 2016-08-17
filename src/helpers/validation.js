import * as validator from 'validator';
import ko from 'knockout';
import * as $ from 'jquery';

class ValidationHelper {

    constructor() {

    }

    /*
    Validate: options = {
        input: the string being validated, e.g. 'john@blaaa.c'
        typeCheck: what to validate it against, e.g. valid email address = 'isEmail'
        inputName: what to call the input in the failure msg (optional), e.g. 'Email'. If not passed it will use the input passed in, e.g. 'john@blaaa.c'
        failText: custom fail message, e.g. 'is a shit email address' (optional)
        params: required for some validator methods, e.g. `length` requires {min: x, max: y}
        showFlash: Do we show a flash error msg on validation failure. Defaults to true.
    }
    */
    Validate(options) {

        console.assert(options.input != null);
        console.assert(options.typeCheck != null);

        var defaults = {
            showFlash: true,
            params: {}
        }

        _.defaults(options, defaults);

        var input = ko.unwrap(options.input);
        var inputName = options.inputName || input;
        var failText = options.failText || this.generateFailMessage(inputName, options.typeCheck, options.params)

    	if ( validator[options.typeCheck](input, options.params) ) {
            return {
    			isValid: true
    		}
    	} else {

            if ( options.showFlash ) {
                app.flash.Error( "<strong>Oops!</strong> ", failText );
            }
    		return {
    			isValid: false,
    			message: failText
    		}
    	}
    }

    ValidateAll(inputs) {
        for (var i of inputs) {
            if ( !this.Validate(i).isValid ) {
                return false;
            }
        }

        return true;
    }

    generateFailMessage(inputName, typeCheck, params={}) {
    	switch(typeCheck) {
	    	case 'isEmail':
	    		return `${inputName} must be a valid email address`;
	    	case 'isBoolean':
	    		return `${inputName} must be either true or false`;
	    	case 'isDate':
	    		return `${inputName} must be a valid date`;
	    	case 'isDecimal':
	    		return `${inputName} must be a decimal number`;
	    	case 'isInt':
	    		return `${inputName} must be a number`;
	    	case 'isLength':
	    		return `${inputName} must be between ${params.min} and ${params.max} characters long`;
	    	case 'isNumeric':
	    		return `${inputName} must be a number`;

    	}
    }

}

export default ValidationHelper;