/**
 * @author hebert ramos
 */
define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, listView, listMenu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.clienteList', {
            id:'clientes',
            url: '^/clientes',
            jurixPermissoes:'Cliente.Visualizar',
            views:{
                content: {
                    template: listView,
                    controller: 'ListClienteController'
                },
                'menu-superior':{
                    template: listMenu
                }
            },
            resolve:{
                clientesPage: ['ClienteService', function(ClienteService){
                    return ClienteService.findAll();
                }],
                grupos: ['GrupoClienteService', function(GrupoClienteService){
                    return GrupoClienteService.buscarGrupos();
                }]
            }
        });

    }]);
});