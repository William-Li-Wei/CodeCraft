/**
 * Created by william on 06.18.15.
 */
var ccSecurity = angular.module('cc.security', ['cc.utilities']);


/**
 * Security API
 */
ccSecurity.factory('securityApi', ['$http', 'promiseService', function($http, promiseService) {
	// var _host = 'http://www.codecraft.cn/'
	var _host = 'http://localhost/';

	return {
		login: function(email, password) {
			return promiseService.wrap(function(promise) {
				$http.post(_host + 'login', { email: email, password: password }).then(function(res) {
					promise.resolve(res.data);
				}, promise.reject);
			});
		}
	}
}]);


/**
 * Security Services
 */
ccSecurity.provider('security', ['$httpProvider', function($httpProvider) {
	var _roles = {
		open: 1,
		user: 2,
		admin: 3
	};
	var _accessLevels = {
        open: (_userRoles.open | _userRoles.user | _userRoles.admin),
        user: (_userRoles.user | _userRoles.admin),
        admin: (_userRoles.admin)
    };

    return {
    	userRole: _userRoles,
    	accessLevel: _accessLevels,

    	$get: ['$rootScope', 'securityApi', 'localStore', 'promiseService', function($rootScope, securityApi, localStore, promiseService) {
    		return {
    			login: function(email, password) {
    				return promiseService.wrap(function(promise) {
    					securityApi.login(email, password).then(function(res) {
    						promise.resolve(res.user);
    					}, function(err) {
    						promise.reject(err);
    					});
    				});
    			}
    		}
    	}]
    }
}]);