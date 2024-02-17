/**
 * @author hebert ramos
 */
define(['./module', 'text!./view.html', 'text!./menu.html'], function (app, view, menu) {


    'use strict';
    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('layout.configuracoes', {

            url: '^/configuracoes',
            jurixPermissoes:'Configuracoes.Visualizar',
            views:{
                content: {
                    template: view,
                    controller: 'ConfiguracaoController'
                },
                'menu-superior':{
                    template: menu,
                    controller: 'ConfiguracaoController'
                },
            },
            resolve: {
                perfis: ['perfisService', function (perfisService) {
                    return perfisService.findAll();
                }],
                permissoes: ['permissoesService', function (permissoesService) {
                    return permissoesService.findAll();
                }],
                parametroIndexador: ['ParametroService', function(ParametroService){
                    return ParametroService.findByChave('INDEXADOR_SALARIO_MINIMO');
                }]
            },

        });

    }]);
});