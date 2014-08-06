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
 * return min(a,b)
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