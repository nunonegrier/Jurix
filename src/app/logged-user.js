/**
 * @author hebert ramos
 */
define(['angular'], function (angular) {

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var $q = initInjector.get('$q');
    var deferred = $q.defer();

    $http.get('/auth/user')
        .then(function successCallback(response) {
            deferred.resolve(response);
        }, function errorCallback(err) {
            deferred.reject(err);
        });

    return deferred.promise;
});