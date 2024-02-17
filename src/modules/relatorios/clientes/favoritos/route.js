define(['../../module', 'text!./menu.html', 'text!../../favoritos/view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioClietensFavoritos', {
            id: 'favoritoRelatorioProcessos',
            url: '^/relatorio/clientes/favoritos',
            views: {
                content: {
                    template: view,
                    controller: 'favoritoRelatorioControler'
                },
                'menu-superior': {
                    template: menu
                }
            },
            resolve: {
                tipoFiltro:[function(){
                    return 'RELATORIO_CLIENTE';
                }],
                filtroUsuarioPage: ['FiltroService', 'tipoFiltro', function (FiltroService, tipoFiltro) {
                    return FiltroService.findAll({tipoFiltro: tipoFiltro, size:10});
                }],
                stateResultado:[function(){
                    return 'layout.relatorioClienteResultado'
                }]
            }
        });

    }]);
});