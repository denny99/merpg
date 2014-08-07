/**
 * Created by Denny on 31.07.2014.
 */

/**
 * return min(a,b)
 * @param a {int|float|string} first param
 * @param b {int|float|string} second param
 * @returns {int|float|string}
 */
function min(a, b) {
    return a <= b ? a : b;
}

/**
 * min for criticals
 * return min(a,b), but T < A|B|C|D|E
 * @param a {string} first param
 * @param b {string} second param
 * @returns {string}
 */
function minCritical(a, b) {
    if (a == "T") {
        return a;
    }
    if (b == "T") {
        return b;
    }
    return a <= b ? a : b;
}

/**
 * return max(a,b)
 * @param a {int|float|string} first param
 * @param b {int|float|string} second param
 * @returns {int|float|string}
 */
function max(a, b) {
    return a >= b ? a : b;
}

/**
 * sorts a json array
 * @param field field to sort
 * @param reverse ascending or descending?
 * @param primer function used on attribute (e.g. parseInt)
 * @returns {Function}
 */
var sort_by = function (field, reverse, primer) {

    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = [-1, 1][+!!reverse];

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
};

/**
 * creates a guid for new items / monsters etc
 */
var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + s4() + s4() +
            s4() + s4() + s4() + s4();
    };
})();


ko.extenders.numeric = function(target, precision) {
    //create a writeable computed observable to intercept writes to our observable
    var result = ko.computed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, precision),
                newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue),
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};

ko.extenders.intOrNull = function(target) {
    //create a writeable computed observable to intercept writes to our observable
    var result = ko.computed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                valueToWrite = isNaN(newValue) ? undefined : parseFloat(+newValue);

            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};

ko.extenders.id = function(target) {
    //create a writeable computed observable to intercept writes to our observable
    var result = ko.computed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                valueToWrite = newValue == "" ? guid() : newValue;

            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};