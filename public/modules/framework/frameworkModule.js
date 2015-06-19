/**
 * Created by william on 02.04.15.
 */
var ccFramework = angular.module('cc.framework', ['duScroll', 'ngAnimate', 'ui.bootstrap', 'angular-loading-bar']);


/**
 * Config
 */
ccFramework.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/modules/framework/home.html',
            controller: 'HomePageController'
        });
}]);


/**
 * Controllers
 */
ccFramework.controller('MainMenuController', ['$scope', 'frameworkModalFactory', function($scope, frameworkModalFactory) {
    $scope.menuOpened = false;
    var _defaultMenu = {
        buttons: [
            {
                name: '登录注册',
                icon: 'sign-in',
                click: function() {
                    $scope.closeMenu();
                    frameworkModalFactory.showSignInModal();
                }
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

    $scope.menu = angular.copy(_defaultMenu);



    // Interactions
    $scope.toggleMenu = function() {
        $scope.menuOpened = !$scope.menuOpened;
    }
    $scope.closeMenu = function() {
        $scope.menuOpened = false;
    }

    // Menu Events
    $scope.$on('cc-close-menu', function() {
        $scope.closeMenu();
    });
    $scope.$on('cc-set-menu', function(buttons, navigations) {
        if(buttons && buttons instanceof Array) {
            $scope.menu.buttons = angular.copy(buttons);
        }
        if(navigations && navigations instanceof Array) {
            $scope.menu.navigations = angular.copy(navigations);
        }
    });
    $scope.$on('cc-reset-menu', function(buttons, navigations) {
        $scope.menu.buttons = angular.copy(_defaultMenu);
    });
}]);

ccFramework.controller('HomePageController', ['$scope', function($scope) {
    $scope.pageConfig = pageConfig;
    $scope.language = 'chinese';
}]);



/**
 * Modal Factory Services
 */
ccFramework.factory('frameworkModalFactory', ['$modal', function($modal) {
    return {
        showSignInModal: function() {
            console.log('testing modal');
            var modal = $modal.open({
                templateUrl: '/modules/framework/sign-in-modal.html',
                controller: 'SignInModalController'
            });
            return modal.result;
        }
    }
}]);


/**
 * Modal Controllers
 */
ccFramework.controller('SignInModalController', ['$scope', '$modalInstance', 
    function($scope, $modalInstance) {
        // Interactions
        $scope.close = function() {
            $scope.cancel();
        }
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    }]);