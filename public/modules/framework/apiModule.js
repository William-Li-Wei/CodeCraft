/**
 * Created by william on 06.18.15.
 */

var ccApi = angular.module('cc.api', []);


/**
 * User Api
 */
ccApi.factory('userApi', ['$http', 'promiseService', function($http, promiseService) {
    return {
        getUserById: function(id, purpose) {
            return promiseService.wrap(function(promise) {
                $http.get(apiConfig.host + 'api/user/' + id + (purpose ? '?purpose=' + purpose : '')).then(function (res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        }
    }
}]);