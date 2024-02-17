define(['../../module', 'text!./menu.html', 'text!./view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioProcessoNovo', {
            id:'relatorioProcessos',
            url: '^/relatorio/processos/novo',
            views:{
                content: {
                    template: view,
                    controller: 'novoRelatorioProcessoControler'
                },
                'menu-superior':{
                    template: menu
                }
            },
            resolve:{
                estados:['LocalidadeService', function(LocalidadeService){
                    return LocalidadeService.buscarEstados({size:100});
                }],
                centrosCusto:['CentroCustoService', function(CentroCustoService){
                    return CentroCustoService.findAll()
                        .then(function(centroCustoPage){
                            return centroCustoPage._embedded.centroCusto;
                        });
                }],
                tiposAcao:['TipoAcaoService', function(TipoAcaoService){
                    return TipoAcaoService.findAll()
                        .then(function(tipoAcaoPage){
                            return tipoAcaoPage._embedded.tipoAcao;
                        });
                }]
            }
        });

    }]);
});