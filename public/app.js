/**
 * Created by william on 02.04.15.
 */

var codeCraft = angular.module('codeCraft', [ 'ui.router', 'cc.framework']);

codeCraft.config(['$urlRouterProvider', '$locationProvider', '$stateProvider', function($urlRouterProvider, $locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}]);