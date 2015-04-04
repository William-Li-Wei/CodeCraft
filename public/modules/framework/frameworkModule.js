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
    $scope.menuOpened = false;
    $scope.toggleMenu = function() {
        $scope.menuOpened = !$scope.menuOpened;
    }
}]);

ccFramework.controller('HomePageController', ['$scope', function($scope) {
    $scope.pageConfig = pageConfig;
    $scope.language = 'chinese';
}]);