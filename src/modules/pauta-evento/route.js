define(['./module', 'text!./view.html', 'text!./menu.html'], function (app, editView, editMenu) {

    'use strict';

    return app.config(['$stateProvider', function ($stateProvider) {

        var defaultState = {
            views: {
                content: {
                    template: editView,
                    controller: 'pautaEventoController'
                },
                'menu-superior': {
                    template: editMenu,
                    controller: 'pautaEventoController'
                }
            }
        };

        $stateProvider.state('layout.pautaEvento', {
            id: 'pautaEvento',
            url: '^/pautaEventos/novo',
            views: defaultState.views,
            jurixPermissoes: 'Pauta.Visualizar',
            resolve: {
                filtrosUsuario: ['FiltroService', function (FiltroService) {
                    return FiltroService.findAllArray({tipoFiltro: 'PAUTA_EVENTO'});
                }],
                filtroPadrao: ['FiltroService', function (FiltroService) {
                    return FiltroService.buscarPadrao('PAUTA_EVENTO');
                }],
                filtroAtual:['$stateParams', 'pautaEventoService', 'filtroPadrao', function ($stateParams, pautaEventoService, filtroPadrao) {

                    var filtroAtual = pautaEventoService.getFiltroPadraoPauta();

                    if ($stateParams.manterPaginacao) {
                        filtroAtual = pautaEventoService.ultimoFiltro;
                    } else if (filtroPadrao) {
                        filtroAtual = JSON.parse(filtroPadrao.valor);
                        filtroAtual.direction = pautaEventoService.getDirectionCookie();
                    }

                    return filtroAtual;
                }],
                pautaEventosPage: ['pautaEventoService', 'filtroAtual', function (pautaEventoService, filtroAtual) {

                    return pautaEventoService.findAll(filtroAtual);
                }],
                colaboradoresPage: ['colaboradorService', 'SegurancaService', 'usuarioAtual', function (colaboradorService, SegurancaService, usuarioAtual) {
                    if (SegurancaService.possuiPermissao('Pauta.Criar.ParaColaboradores')) {
                        return colaboradorService.findAll();
                    }

                    return colaboradorService.findAll({usuarioId: usuarioAtual.id});
                }],
                idEdit: ['$stateParams', function ($stateParams) {
                    return $stateParams.idEdit;
                }],
                minimoCaracteresObsFinalizacaoPauta:['pautaEventoService', function(pautaEventoService){
                    return pautaEventoService.minimoCaracteresObsFinalizacaoPauta();
                }]
            },
            params: {
                idEdit: null,
                manterPaginacao: null
            }
        });
    }]);
});