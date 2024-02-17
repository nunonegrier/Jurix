/**
 * @author hebert ramos
 */
define(['./module', 'text!./view.html'], function (app, view) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.usuario', {

            url: '^/usuario/novo',
            views: {
                content: {
                    template: view,
                    controller: 'UsuarioEditController'
                },
                'menu-superior':{
                    template: ''
                }
            }
        });

    }]);
});