/**
 * @author hebert ramos
 */
define(['./module'], function(app){


    app.config(['$httpProvider', function ($httpProvider) {

        $httpProvider.interceptors.push(['$q', function ($q) {
            return {

                responseError: function (rejection) {

                    return $q.reject(rejection);
                }
            };
        }]);

    }]);

});