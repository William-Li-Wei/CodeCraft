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

ccUI.filter('briefIntro', function() {
    return function(input, length) {
        var text = '暫時沒有介紹';
        length = length || 65;
        if(typeof input === 'string') {
            if(input.length > length) {
                text = input.substring(0, length - 1) + ' ...';
            } else {
                text = input;
            }
        }
        return text;
    }
});

ccUI.directive('busy', [function() {
    return {
        restrict: 'A',
        template: '<button class="btn btn-sm" ng-click="click()" ng-disabled="disabled() || isBusy"> <span ng-if="isBusy"><i ng-class="icon"></i></span> <span ng-transclude></span> </button>',
        replace: true,
        transclude: true,
        scope: {
            busy: '&',
            busyIcon: '@',
            busyDisabled: '&'
        },
        link: function(scope, element, attrs) {
            scope.isBusy = false;
            scope.icon = scope.busyIcon || 'fa fa-spinner fa-spin';
            scope.disabled = scope.busyDisabled || function () {
                    return false;
                };

            scope.click = function() {
                var promise = scope.busy();
                if (typeof promise == 'object' && typeof promise.finally == 'function') {
                    scope.isBusy = true;
                    promise.finally(function () {
                        scope.isBusy = false;
                    });
                }
            }
        }
    }
}]);

ccUI.directive('albumPreview', [function() {
    return {
        restrict: 'C',
        templateUrl: '/modules/tutorials/album-preview.html',
        scope: {
            getAlbum: '&album',
            closePreview: '&close'
        },
        link: function(scope, element, attrs) {
            scope.album = scope.getAlbum();
            scope.viewAlbum = function() {
                console.log(scope.album);
            }
        }
    }
}]);