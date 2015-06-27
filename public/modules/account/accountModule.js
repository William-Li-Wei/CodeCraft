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
        });
}]);

/**
 * Controllers
 */
ccAccount.controller('ProfileController', ['$rootScope' ,'$scope', 'user' , function($rootScope, $scope, user) {
    $scope.user = user;
    $scope.isVisitor =  $rootScope.user && $rootScope.user._id === $scope.user._id;
}]);