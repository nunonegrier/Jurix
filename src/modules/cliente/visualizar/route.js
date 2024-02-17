/**
 * @author hebert ramos
 */
define(['../module', 'text!./view-fisico.html', 'text!./view-juridico.html', 'text!./menu.html'], function (app, viewFisico, viewJuridico, viewMneu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        var resolvers = {
            contratos: ['$stateParams', 'ContratoService', function($stateParams, ContratoService) {

                return ContratoService.findAll({clienteId: $stateParams.id});
            }],
            processos:['$stateParams', 'ProcessoService', function($stateParams, ProcessoService) {

                return ProcessoService.findAll({clienteId: $stateParams.id})
                    .then(function(processoPage){
                        return processoPage.content;
                    });
            }]
        };

        $stateProvider.state('layout.clienteFisicoVisualizar', {
            id:'clientes',
            url: '^/cliente/viewFisico/:id',
            views:{
                content: {
                    template: viewFisico,
                    controller: 'ViauzliarClienteController'
                },
                'menu-superior':{
                    template: viewMneu,
                    controller: 'ViauzliarClienteController'
                }
            },
            resolve:{
                cliente: ['$stateParams', 'ClienteService', function($stateParams, ClienteService){

                    return ClienteService.findById($stateParams.id);
                }],
                contratos: resolvers.contratos,
                processos: resolvers.processos
            }
        });

        $stateProvider.state('layout.clienteJuridicoVisualizar', {
            id:'clientes',
            url: '^/cliente/viewJuridico/:id',
            views:{
                content: {
                    template: viewJuridico,
                    controller: 'ViauzliarClienteController'
                },
                'menu-superior':{
                    template: viewMneu,
                    controller: 'ViauzliarClienteController'
                }
            },
            resolve:{
                cliente: ['$stateParams', 'ClienteService', function($stateParams, ClienteService){

                    return ClienteService.findById($stateParams.id);
                }],
                contratos: resolvers.contratos,
                processos: resolvers.processos
            }
        });



    }]);
});