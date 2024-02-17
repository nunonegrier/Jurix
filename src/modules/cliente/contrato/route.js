/**
 * @author hebert ramos
 */
define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, contratoView, menuView) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        var isFromSalvarResolver = ['$stateParams', function ($stateParams) {
            return $stateParams.isFromSalvar;
        }];

        var arquivosResolve = ['$stateParams', 'FileService', function($stateParams, FileService){
            if($stateParams.id) {
                return FileService.listFiles('contrato/' + $stateParams.id).then(function(folder){
                    if(folder){
                        return folder.childrens;
                    }
                    return [];
                });
            }else{
                return [];
            }
        }];

        var centrosCustoResolve = ['CentroCustoService', function(CentroCustoService){
            return CentroCustoService.findAll()
                .then(function(centroCustoPage){
                    return centroCustoPage._embedded.centroCusto;
                });
        }];


        $stateProvider.state('layout.clienteContratoNovo', {
            id: 'clientes',
            url: '^/cliente/:clienteId/contrato/novo',
            jurixPermissoes:'Cliente.Contrato.Cadastrar',
            views: {
                content: {
                    template: contratoView,
                    controller: 'ContratoController'
                },
                'menu-superior': {
                    template: menuView,
                    controller: 'ContratoMenuController'
                }
            },
            resolve: {
                cliente: ['$stateParams', 'ClienteService', function ($stateParams, ClienteService) {
                    return ClienteService.findById($stateParams.clienteId);
                }],
                contrato: ['cliente', function (cliente) {
                    return {cliente: cliente, centroCusto: {}}
                }],
                visualizar: function () {
                    return false;
                },
                isFromSalvar: isFromSalvarResolver,
                arquivos: arquivosResolve,
                centrosCusto: centrosCustoResolve
            },
            params: {
                isFromSalvar: null
            }
        });

        $stateProvider.state('layout.clienteContratoVisualizar', {
            id: 'clientes',
            url: '^/cliente/:clienteId/viewContrato/:id/',
            views: {
                content: {
                    template: contratoView,
                    controller: 'ContratoController'
                },
                'menu-superior': {
                    template: menuView,
                    controller: 'ContratoMenuController'
                }
            },
            resolve: {
                contrato: ['$stateParams', 'ContratoService', function ($stateParams, ContratoService) {
                    return ContratoService.findById($stateParams.clienteId, $stateParams.id);
                }],
                cliente: ['contrato', function (contrato) {
                    return contrato.cliente;
                }],
                visualizar: function () {
                    return true;
                },
                isFromSalvar: isFromSalvarResolver,
                arquivos: arquivosResolve,
                centrosCusto: centrosCustoResolve
            },
            params: {
                isFromSalvar: null
            }
        });

        $stateProvider.state('layout.clienteContratoEditar', {
            id: 'clientes',
            url: '^/cliente/:clienteId/editContrato/:id/',
            jurixPermissoes:'Cliente.Contrato.Editar',
            views: {
                content: {
                    template: contratoView,
                    controller: 'ContratoController'
                },
                'menu-superior': {
                    template: menuView,
                    controller: 'ContratoMenuController'
                }
            },
            resolve: {
                contrato: ['$stateParams', 'ContratoService', function ($stateParams, ContratoService) {
                    return ContratoService.findById($stateParams.clienteId, $stateParams.id);
                }],
                cliente: ['contrato', function (contrato) {
                    return contrato.cliente;
                }],
                visualizar: function () {
                    return false;
                },
                isFromSalvar: isFromSalvarResolver,
                arquivos: arquivosResolve,
                centrosCusto: centrosCustoResolve
            },
            params: {
                isFromSalvar: null
            }
        });


    }]);
});