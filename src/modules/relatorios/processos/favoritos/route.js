define(['../../module', 'text!../../favoritos/menu.html', 'text!../../favoritos/view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioProcessoFavoritos', {
            id: 'favoritoRelatorioProcessos',
            url: '^/relatorio/processos/favoritos',
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
                    return 'RELATORIO_PROCESSO';
                }],
                filtroUsuarioPage: ['FiltroService', 'tipoFiltro', function (FiltroService, tipoFiltro) {
                    return FiltroService.findAll({tipoFiltro: tipoFiltro, size:10});
                }],
                stateResultado:[function(){
                    return 'layout.relatorioProcessoResultado'
                }]
            }
        });

    }]);
});