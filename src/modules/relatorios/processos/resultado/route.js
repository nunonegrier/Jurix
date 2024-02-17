define(['../../module', 'text!../../resultado/menu.html', 'text!../../resultado/view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioProcessoResultado', {
            id: 'relatorioProcessos',
            url: '^/relatorio/processos/resultado/:idFiltro',
            views: {
                content: {
                    template: view,
                    controller: 'resultadoRelatorioProcessoControler'
                },
                'menu-superior': {
                    template: menu
                }
            },
            params: {
                idFiltro: null,
                filtroProcesso: null
            },
            resolve: {
                filtroResultado: ['$stateParams', '$cookies', 'FiltroService', function ($stateParams, $cookies, FiltroService) {

                    if($stateParams.idFiltro){
                        return FiltroService.findById($stateParams.idFiltro)
                            .then(function(filtroSalvo){
                                return JSON.parse(filtroSalvo.valor);
                            });
                    }

                    if (!$stateParams.filtroProcesso) {
                        return $cookies.getObject('ultimoRelatoioFiltroProcesso');
                    }

                    $cookies.putObject('ultimoRelatoioFiltroProcesso', $stateParams.filtroProcesso);
                    return $stateParams.filtroProcesso;
                }],
                colunasResultado: ['filtroResultado', function(filtroResultado){
                    return filtroResultado.colunas;

                }],
                processosResultado: ['filtroResultado', 'ProcessoService', function(filtroResultado, ProcessoService){

                    return ProcessoService.findAll(filtroResultado)
                        .then(function(processosPage){
                            return processosPage.content;
                        });

                }],
                favoritos:['FiltroService', function(FiltroService){
                    return FiltroService.findAllArray({tipoFiltro: 'RELATORIO_PROCESSO'});
                }]
            }
        });

    }]);
});