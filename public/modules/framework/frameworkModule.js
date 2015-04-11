/**
 * Created by william on 02.04.15.
 */

var ccFramework = angular.module('cc.framework', ['duScroll', 'ngAnimate', 'ui.bootstrap', 'angular-loading-bar']);

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
    $scope.menu = {
        buttons: [
            {
                name: '登录注册',
                icon: 'sign-in'
            }
        ],
        navigations: [
            { name: '源艺首页', icon: 'home' },
            { name: '专辑大厅', icon: 'institution'},
            { name: '讨论专区', icon: 'comments-o' },
            { name: '数据统计', icon: 'area-chart' },
            { name: '关于本站', icon: 'sitemap' }
        ]
    }



    // Interactions
    $scope.toggleMenu = function() {
        $scope.menuOpened = !$scope.menuOpened;
    }

    // Menu Events
    $scope.$on('cc-set-menu', function(buttons, navigations) {
        if(buttons && buttons instanceof Array) {
            $scope.menu.buttons = buttons;
        }
        if(navigations && navigations instanceof Array) {
            $scope.menu.navigations = navigations;
        }
    });
}]);

ccFramework.controller('HomePageController', ['$scope', function($scope) {
    $scope.pageConfig = pageConfig;
    $scope.language = 'chinese';
}]);