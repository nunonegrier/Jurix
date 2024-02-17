define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, editView, editMenu) {

    'use strict';

    return app.config(['$stateProvider', function ($stateProvider) {

        var defaultState = {
            views: {
                content: {
                    template: editView,
                    controller: 'pautaEventoControllerGeral'
                },
                'menu-superior': {
                    template: editMenu,
                    controller: 'pautaEventoControllerGeral'
                }
            }
        };

        $stateProvider.state('layout.pautaEventoGeral', {
            id: 'pautaEvento',
            url: '^/pautaEventos/geral',
            views: defaultState.views,
            jurixPermissoes:'Pauta.VisualizarGeral',
            resolve: {
                filtrosUsuario:['FiltroService', function(FiltroService){
                   return FiltroService.findAllArray({tipoFiltro: 'PAUTA_EVENTO'});
                }],
                pautaEventosPage: ['pautaEventoService', function (pautaEventoService) {
                    return pautaEventoService.findAllGeneral({sort: 'dataLimite', direction: 'desc', orderSituacao: 'PENDENTE', size: '10'});
                }],
                colaboradoresPage: ['colaboradorService', 'SegurancaService', 'usuarioAtual', function (colaboradorService, SegurancaService, usuarioAtual) {
                    if(SegurancaService.possuiPermissao('Pauta.Criar.ParaColaboradores')){
                        return colaboradorService.findAll();
                    }

                    return colaboradorService.findAll({usuarioId: usuarioAtual.id});
                }]
            }
        });
    }]);
});