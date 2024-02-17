/**
 * @author hebert ramos
 */
define(['./module', 'text!./view.html', 'text!./menu.html'], function (app, view, menu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.financeiro', {

            url: '^/financeiro',
            views:{
                content: {
                    template: view,
                    controller: 'financeiroController'
                },
                'menu-superior':{
                    template: menu
                }
            },
            jurixPermissoes:'Financeiro.Visualizar',
            resolve:{
                serverDataHora:[function(){
                    return new Date();
                }],
                centroCusto:['financeiroService', function(financeiroService){
                   return financeiroService.getCentroCustoDefault();
                }],
                centrosCusto:['CentroCustoService', function(CentroCustoService){
                    return CentroCustoService.findAll()
                        .then(function(centroCustoPage){
                            return centroCustoPage._embedded.centroCusto;
                        });
                }],
                financeiroDTO:['financeiroService', 'centroCusto', 'serverDataHora', function(financeiroService, centroCusto, serverDataHora){
                    return financeiroService.buscarDadosFinanceiros(serverDataHora.getMonth() + 1, serverDataHora.getFullYear(), centroCusto.id);
                }]
            }

        });

    }]);
});