/**
 * @author hebert ramos
 */
define(['./module', 'text!./view.html'], function (app, view) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout', {
            abstract:true,
            template: view,
            controller:'LayoutController',
            resolve:{
                usuarioAtual:['$http', '$q', function($http, $q){

                    var deferred = $q.defer();

                    $http.get('/auth/user').then(function(resp){
                        deferred.resolve(resp.data);
                    }, function(err){
                       deferred.resolve(null);
                    });

                    return deferred.promise;
                }]

            }
        });

    }]);
});