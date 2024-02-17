define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, listView, listMenu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.colaboradorList', {
            id:'colaboradores',
            url: '^/colaboradores',
            jurixPermissoes:'Colaborador.Visualizar',
            views:{
                content: {
                    template: listView,
                    controller: 'listColaboradorController'
                },
                'menu-superior':{
                    template: listMenu
                }
            },
            resolve:{
                colaboradoresPage:['colaboradorService', function(colaboradorService){
                    return colaboradorService.findAll({size: 1000});
                }],
                perfis: ['colaboradorService', function (colaboradorService) {
                    return colaboradorService.buscarPerfis();
                }]
            }
        });

    }]);
});