define(['../../module', 'text!./menu.html', 'text!../../resultado/view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioPautaResultado', {
            id: 'relatorioClientes',
            url: '^/relatorio/pauta/resultado/:idFiltro',
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
                filtroPauta: null
            },
            resolve: {
                filtroResultado: ['$stateParams', '$cookies', 'FiltroService', function ($stateParams, $cookies, FiltroService) {

                    if($stateParams.idFiltro){
                        return FiltroService.findById($stateParams.idFiltro)
                            .then(function(filtroSalvo){
                                return JSON.parse(filtroSalvo.valor);
                            });
                    }

                    if (!$stateParams.filtroPauta) {
                        return $cookies.getObject('ultimoRelatoioFiltroPauta');
                    }

                    $cookies.putObject('ultimoRelatoioFiltroPauta', $stateParams.filtroPauta);
                    return $stateParams.filtroPauta;
                }],
                colunasResultado: ['filtroResultado', function(filtroResultado){
                    return filtroResultado.colunas;

                }],
                processosResultado: ['filtroResultado', 'pautaEventoService', function(filtroResultado, pautaEventoService){

                    var filtro = angular.copy(filtroResultado);
                    delete filtro.colunas;

                    return pautaEventoService.findAllGeneral(filtro)
                        .then(function(pautaPage){
                            return pautaPage.content;
                        });

                }],
                favoritos:['FiltroService', function(FiltroService){
                    return FiltroService.findAllArray({tipoFiltro: 'RELATORIO_PAUTA'});
                }]
            }
        });

    }]);
});