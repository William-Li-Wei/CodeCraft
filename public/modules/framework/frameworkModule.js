/**
 * Created by william on 02.04.15.
 */

var ccFramework = angular.module('cc.framework', []);

ccFramework.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/modules/framework/home.html',
            controller: 'HomePageController'
        });
}]);

ccFramework.controller('MainMenuController', ['$scope', function($scope) {
    console.log('main menu controller triggered.');
}]);

ccFramework.controller('HomePageController', ['$scope', function($scope) {
    console.log('homepage controller triggered.');
}]);