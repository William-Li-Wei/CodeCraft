/**
 * Created by william on 06.18.15.
 */
var ccSecurity = angular.module('cc.security', []);


/**
 * Security API
 */
ccSecurity.factory('securityApi', ['$http', 'promiseService', function($http, promiseService) {
	// var _host = 'http://www.codecraft.cn/'
	var _host = 'http://localhost:3000/';

	return {
		login: function(email, password) {
			return promiseService.wrap(function(promise) {
				$http.post(_host + 'login', { email: email, password: password }).then(function(res) {
					promise.resolve(res.data);
				}, promise.reject);
			});
		},
		getCurrentUser: function() {
			return promiseService.wrap(function(promise) {
				$http.get(_host + 'current-user').then(function (res) {
					promise.resolve(res.data);
				}, promise.reject);
			});
		}
	}
}]);


/**
 * Security Services
 */
ccSecurity.provider('security', ['$httpProvider', function() {
	var _defaultUser = {
		email: ''
	};

	var _lastMessage = undefined;

    return {
    	$get: ['$rootScope', 'securityApi', 'localStore', 'promiseService', function($rootScope, securityApi, localStore, promiseService) {
			var _user = _getUser();
			securityApi.getCurrentUser().then(function (res) {
				if (res.user !== null) {
					_user = _setUser(res.user);
					$rootScope.$broadcast('cc::security::login', _user);
				}
			});

			$rootScope.$on('cc::security::logout', function () {
				localStore.removeItem('user');
			});

			function _getUser() {
				return localStore.getItem('user') || _defaultUser;
			}
			function _setUser(user) {
				user = user || _defaultUser;
				localStore.setItem('user', user);
				return user;
			}
			function _removeUser() {
				localStore.removeItem('user');
			}

			return {
				lastMessage: function () {
					return _lastMessage;
				},
				currentUser: function () {
					return _user;
				},
    			login: function(email, password) {
    				return promiseService.wrap(function(promise) {
    					securityApi.login(email, password).then(function(res) {
							if(res.user) {
								_setUser(res.user);
								_user = _getUser();
								$rootScope.$broadcast('cc::security::login', _user);
								promise.resolve(res.user);
							} else {
								_removeUser();
								promise.reject();
							}
    					}, function(err) {
							if(err.status === 404) {
								_lastMessage = {
									type: 'warning',
									text: '您提供的电子邮箱或密码不正确, 请确认后再尝试登录.'
								}
							} else {
								_lastMessage = {
									type: 'error',
									text: '源艺遇到了一些问题, 请稍候再试或者联系管理员 codecraft.cn@gmailcom'
								}
							}
							_removeUser();
    						promise.reject(err);
    					});
    				});
    			}
    		}
    	}]
    }
}]);