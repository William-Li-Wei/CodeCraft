/**
 * Created by william on 27.06.15.
 */
var ccUI = angular.module('cc.ui', []);

ccUI.filter('cnDate', function() {
    var isDate = function(date) {
        return ( (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ));
    }
    var addPrefix = function(num) {
        if(num < 10) {
            num = '0' + num;
        }
        return num;
    }

    return function(input) {
        if(!isDate(input)) {
            return '某年某月';
        } else {
            var date = new Date(input);
            return date.getFullYear() + '-' + addPrefix(date.getMonth() - 1) + '-' + addPrefix(date.getDate());
        }
    };
});