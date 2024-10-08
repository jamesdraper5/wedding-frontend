import ko from 'knockout';
import $ from 'jquery';
import moment from 'moment';
import rome from 'rome';

function init(element, valueAccessor, allBindings, data, context) {
    var options = allBindings().dateInputOptions || {};
    var allowEmpty = !!options.allowEmpty;
    var appendTo = options.appendTo;
    var hasTime = options.hasTime || false;
    var displayFormat = options.format || app.constants.DATEFORMATS.long;

    var picker = rome(element, {
        time: hasTime,
        inputFormat: displayFormat,
        weekdayFormat: 'short',
        dayFormat: 'D',
        weekStart: 1,
        required: !allowEmpty,
        appendTo: appendTo
    });

    var $e = $(element);
    var $container = $(picker.container);

    $e.attr('placeholder', 'No Date');
    $e.addClass('date-input');
    $container.addClass('popup');

   	$container.css('margin-left', 0);

    function updateValueAccessor() {
        var inputValue = $e.val();
        var date = null;
        if ( inputValue ) {
            date = moment(inputValue, displayFormat);
        }
        var currentMoment = valueAccessor()();

        var isDateValid = moment.isMoment(date) && date.isValid();
        var isCurrentMomentValid = moment.isMoment(currentMoment) && currentMoment.isValid();

        if ( isDateValid ) {
            picker.setValue(date);
            $e.val( date.format(displayFormat) );

            var year = date.year(),
                month = date.month(),
                day = date.date(),
                hour = date.hour(),
                minute = date.minute(),
                selectedDate;

            if ( isCurrentMomentValid ) {
                var datesEqual = currentMoment.year() == year && currentMoment.month() == month && currentMoment.date() == day && currentMoment.hour() == hour && currentMoment.minute() == minute;
                if ( !datesEqual ) {
                    if ( hasTime ) {
                        selectedDate = currentMoment.clone().year(year).month(month).date(day).hour(hour).minute(minute).second(0)
                    } else {
                        selectedDate = currentMoment.clone().year(year).month(month).date(day)
                    }
	                valueAccessor()(selectedDate)
                }
            } else {
                if ( hasTime ) {
                    valueAccessor()( moment().year(year).month(month).date(day).hour(hour).minute(minute).second(0) );
                } else {
                    valueAccessor()( moment().year(year).month(month).date(day) );
                }
            }
        } else {
            if ( isCurrentMomentValid ) {
                if ( allowEmpty && !inputValue ) {
                    valueAccessor()( null );
                } else {
                    picker.setValue(currentMoment.clone());
                    $e.val( currentMoment.format(displayFormat) );
                }
            } else {
                if ( currentMoment === null ) {
                    $e.val('');
                } else {
                    valueAccessor()( null );
                }
            }
        }

    }

    picker.on('data', () => {
        updateValueAccessor()
        return
    });

    $e.on('blur', () => {
        updateValueAccessor()
        return
    });

    $e.on('keydown', (event) => {
        if ( event.keyCode == 13 ) {
	        updateValueAccessor()
        }
        return
    });

    ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
        picker.destroy();
        $e.off();
        return;
    });

    // initialize the valueAccessor and the input field
    update.apply(this, arguments);

}

function update(element, valueAccessor, allBindings, data, context) {
    var options = allBindings().dateInputOptions || {};
    var allowEmpty = !!options.allowEmpty;
    var displayFormat = options.format || app.constants.DATEFORMATS.long;

    var picker = rome.find(element);
    var currentMoment = valueAccessor()();

    if ( currentMoment === null ) {
        if ( allowEmpty ) {
            picker.setValue(null);
            $(element).val('');
        } else {
            valueAccessor()( moment() );
        }
    } else if ( moment.isMoment(currentMoment) && currentMoment.isValid() ) {
        picker.setValue( currentMoment.clone() );
        $(element).val( currentMoment.format(displayFormat) );
    } else {
        if ( allowEmpty ) {
            valueAccessor()( null );
        } else {
            valueAccessor()( moment() );
        }
    }

}

ko.bindingHandlers.dateInput = {
    init: init,
    update: update
}
