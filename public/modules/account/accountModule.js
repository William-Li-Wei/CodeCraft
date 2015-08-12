/**
 * Created by william on 27.06.15.
 */
var ccAccount = angular.module('cc.account', []);


/**
 * Config
 */
ccAccount.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('profile', {
            url: '/profile/:id',
            templateUrl: '/modules/account/profile.html',
            controller: 'ProfileController',
            resolve: {
                user: ['$stateParams', 'userApi', function($stateParams, userApi) {
                    return userApi.getUserById($stateParams.id, 'profile');
                }]
            }
        })
        .state('activation', {
            url: '/account/activate/:hashCode',
            templateUrl: '/modules/account/activate.html',
            controller: 'ActivationController'
        });
}]);

/**
 * Controllers
 */
ccAccount.controller('ProfileController', ['$rootScope' ,'$scope', 'user' , function($rootScope, $scope, user) {
    $scope.user = user;
    $scope.isVisitor =  $rootScope.user && $rootScope.user._id === $scope.user._id;
}]);

ccAccount.controller('ActivationController', ['$scope', '$state', '$stateParams', '$interval', 'security', function($scope, $state, $stateParams, $interval, security) {
    // activate user account
    security.activate($stateParams.hashCode)
        .then(function(res) {
            $scope.message = security.lastMessage();
            _startCountDown();
        }, function(err) {
            _startCountDown();
            $scope.message = security.lastMessage();
        });

    // count down and jump to homepage
    var countDown;
    function _startCountDown() {
        $scope.counter = 10;
        countDown = $interval(_countingDown, 1000);
    }
    function _countingDown() {
        $scope.counter--;
        if($scope.counter === 0) {
            _stopCountDown();
        }
    }
    function _stopCountDown() {
        $interval.cancel(countDown);
        $state.go('home');
    }
}]);