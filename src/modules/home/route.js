/**
 * @author hebert ramos
 */
define(['./module', 'text!./view.html', 'text!./menu.html'], function (app, view, menu) {


    'use strict';
    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('layout.home', {

            url: '^/home',
            views:{
                content: {
                    template: view,
                    controller: 'HomeController'
                },
                'menu-superior':{
                    template: menu,
                    controller: 'HomeController'
                },
            },
            resolve: {
                dashBoard: ['$http', '$q', function ($http, $q) {

                    var deferred = $q.defer();

                    $http.get('/dashboard').then(function (resp) {
                        deferred.resolve(resp.data);
                    }, function (err) {
                        deferred.resolve(null);
                    });

                    return deferred.promise;
                }]
            }
        });

    }]);
});