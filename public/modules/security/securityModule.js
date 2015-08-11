/**
 * Created by william on 06.18.15.
 */
var ccSecurity = angular.module('cc.security', []);


/**
 * Security API
 */
ccSecurity.factory('securityApi', ['$http', 'promiseService', function($http, promiseService) {
	return {
		getCurrentUser: function() {
			return promiseService.wrap(function(promise) {
				$http.get(apiConfig.host + 'current-user').then(function (res) {
					promise.resolve(res.data);
				}, promise.reject);
			});
		},
		login: function(email, password) {
			return promiseService.wrap(function(promise) {
				$http.post(apiConfig.host + 'login', { email: email, password: password }).then(function(res) {
					promise.resolve(res.data);
				}, promise.reject);
			});
		},
		register: function(email, password, username) {
			return promiseService.wrap(function(promise) {
				$http.post(apiConfig.host + 'api/register', { email:email, password: password, username: username })
					.then(function(res) {
						promise.resolve(res.data);
					}, promise.reject);
			});
		},
		activate: function(hashCode) {
			return promiseService.wrap(function(promise) {
				$http.post(apiConfig.host + 'api/activate', { hashCode: hashCode })
					.then(function(res) {
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
    					securityApi.login(email, password)
							.then(function(res) {
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
										type: 'danger',
										text: '身份验证失败，请检查您输入的电子邮箱和登录密码.'
									};
								} else {
									_lastMessage = {
										type: 'danger',
										text: '身份验证遇到问题，请稍后重试或者联系 codecraft.cn@gmail.com 我们会努力解决您的问题.'
									}
								}
								_removeUser();
								promise.reject(err);
    						});
    				});
    			},
				register: function(email, password, username) {
					return promiseService.wrap(function(promise) {
						securityApi.register(email, password, username)
							.then(function(res) {
								if(res.message == 'Email in use.') {
									_lastMessage = {
										type: 'warning',
										text: '该邮箱已经被注册，请尝试其他邮箱或直接进行登录.'
									};
								}
								if(res.message == 'Email sent.') {
									_lastMessage = {
										type: 'info',
										text: '验证邮件发送成功，请登录邮箱并激活账户.'
									};
								}
								promise.resolve();
							}, function(err) {
								if(err.status === 400) {
									_lastMessage = {
										type: 'danger',
										text: '您刚刚提交了一个无效的请求, 请通过源艺页面提交注册.'
									}
								} else {
									_lastMessage = {
										type: 'danger',
										text: '用户注册遇到问题，请稍后重试或者联系 codecraft.cn@gmail.com 我们会努力解决您的问题.'
									}
								}
								_removeUser();
								promise.reject(err);
							});
					});
				},
				activate: function(hashCode) {
					return promiseService.wrap(function(promise) {
						securityApi.activate(hashCode)
							.then(function(res) {
								_lastMessage = {
									type: 'info',
									text: '源艺账户已经激活, 您随时可以通过右下角的菜单进行登录.'
								};
								promise.resolve();
							}, function(err) {
								if(err.status === 400) {
									_lastMessage = {
										type: 'danger',
										text: '您刚刚提交了一个无效的请求, 请点击您的源艺邮件中的链接进行账户激活.'
									}
								}
								else if(err.status === 404){
									_lastMessage = {
										type: 'warning',
										text: '您的激活链接已经过期, 请重新注册并获得心得激活链接.'
									}
								}
								else {
									_lastMessage = {
										type: 'danger',
										text: '账户激活遇到问题，请稍后重试或者联系 codecraft.cn@gmail.com 我们会努力解决您的问题.'
									}
								}
								promise.reject(err);
							});
					});
				}
    		}
    	}]
    }
}]);