define(['../../module', 'text!./menu.html', 'text!../../resultado/view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioClienteResultado', {
            id: 'relatorioClientes',
            url: '^/relatorio/clientes/resultado/:idFiltro',
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
                filtroCliente: null
            },
            resolve: {
                filtroResultado: ['$stateParams', '$cookies', 'FiltroService', function ($stateParams, $cookies, FiltroService) {

                    if($stateParams.idFiltro){
                        return FiltroService.findById($stateParams.idFiltro)
                            .then(function(filtroSalvo){
                                return JSON.parse(filtroSalvo.valor);
                            });
                    }

                    if (!$stateParams.filtroCliente) {
                        return $cookies.getObject('ultimoRelatoioFiltroCliente');
                    }

                    $cookies.putObject('ultimoRelatoioFiltroCliente', $stateParams.filtroCliente);
                    return $stateParams.filtroCliente;
                }],
                colunasResultado: ['filtroResultado', function(filtroResultado){
                    return filtroResultado.colunas;

                }],
                processosResultado: ['filtroResultado', 'ClienteService', function(filtroResultado, ClienteService){

                    var filtro = angular.copy(filtroResultado);
                    delete filtro.colunas;

                    return ClienteService.findAll(filtro)
                        .then(function(clientesPage){
                            return clientesPage.content;
                        });

                }],
                favoritos:['FiltroService', function(FiltroService){
                    return FiltroService.findAllArray({tipoFiltro: 'RELATORIO_CLIENTE'});
                }]
            }
        });

    }]);
});