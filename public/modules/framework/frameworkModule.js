/**
 * Created by william on 02.04.15.
 */
var ccFramework = angular.module('cc.framework', []);


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
ccFramework.controller('MainMenuController', ['$rootScope', '$scope', '$state', 'security', 'frameworkModalFactory', function($rootScope, $scope, $state, security, frameworkModalFactory) {
    // Initialization
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


    // System Events
    $rootScope.$on('cc::security::login', function() {
        $rootScope.user = security.currentUser();
    });

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

    // Profile Events
    $scope.viewProfile = function() {
        $state.go('profile', { id: $rootScope.user._id });
    };
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
ccFramework.controller('SignInModalController', ['$scope', '$modalInstance', 'toastr', 'security',
    function($scope, $modalInstance, toastr, security) {
        // Initialization
        $scope.mode = 'login';
        $scope.userData = {};

        // Interactions
        $scope.close = function() {
            $scope.cancel();
        }
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
        $scope.toggle = function() {
            if($scope.mode === 'login') {
                $scope.mode = 'register';
            } else {
                $scope.mode = 'login';
            }
        }
        $scope.formValid = function(form) {
            var valid = true;
            if(!form.email.$valid) {
                valid = false;
            }
            if($scope.mode === 'login') {
                if(!form.password.$valid) {
                    valid = false;
                }
            } else {
                if(!form.password.$valid || $scope.userData.password !== $scope.userData.password2) {
                    valid = false;
                }
            }
            return valid;
        }
        $scope.login = function() {
            security.login($scope.userData.email, $scope.userData.password)
                .then(function(user) {
                    toastr.success('欢迎来到源艺, ' + user.username, '欢迎');
                    $scope.close();
                }, function(err) {
                    $scope.message = security.lastMessage();
                });
        }
        $scope.register = function() {
            console.log($scope.userData);
        }
        $scope.keyPress = function(event) {
            if(event.which === 13) {
                $scope.login();
                event.preventDefault();
            }
        }
    }]);