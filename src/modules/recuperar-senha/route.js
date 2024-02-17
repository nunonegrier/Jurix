/**
 * @author hebert ramos
 */
define(['./module', 'text!./view.html'], function (app, view) {


    'use strict';

    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('recuperarSenha', {

            url: '^/recuperarSenha?${token}',
            template: view,
            controller: 'RecuperarSenhaController',
            params:{
                token:null
            }
        });

    }]);
});