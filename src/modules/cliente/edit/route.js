/**
 * @author hebert ramos
 */
define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, formView, formMenu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        var estadoResolve = ['LocalidadeService', function(LocalidadeService){
            return LocalidadeService.buscarEstados({size:100});
        }];

        var isFromNovoResolver = ['$stateParams', function($stateParams){
           return $stateParams.isFromNovo;
        }];

        var grupoClienteResolve = ['GrupoClienteService', function(GrupoClienteService){
            return GrupoClienteService.buscarGrupos();
        }];

        var arquivosResolve = ['$stateParams', 'FileService', function($stateParams, FileService){
            if($stateParams.id) {
                return FileService.listFiles('cliente/' + $stateParams.id).then(function(folder){
                    if(folder){
                        return folder.childrens;
                    }
                    return [];
                });
            }else{
                return [];
            }
        }];

        $stateProvider.state('layout.clienteFisicoEditar', {
            id:'clientes',
            url: '^/cliente/editFisico/:id',
            jurixPermissoes:'Cliente.Editar',
            views:{
                content: {
                    template: formView,
                    controller: 'FormClienteController'
                },
                'menu-superior':{
                    template: formMenu
                }
            },
            resolve:{
                cliente: ['$stateParams', 'ClienteService', function($stateParams, ClienteService){
                    return ClienteService.findById($stateParams.id);
                }],
                estados:estadoResolve,
                isFromNovo: isFromNovoResolver,
                grupos: grupoClienteResolve
            },
            params: {
                isFromNovo: null
            }
        });

        $stateProvider.state('layout.clienteJuridicoEditar', {
            id:'clientes',
            url: '^/cliente/editJuridico/:id',
            jurixPermissoes:'Cliente.Editar',
            views:{
                content: {
                    template: formView,
                    controller: 'FormClienteController'
                },
                'menu-superior':{
                    template: formMenu
                }
            },
            resolve:{
                cliente: ['$stateParams', 'ClienteService', function($stateParams, ClienteService){
                    return ClienteService.findById($stateParams.id);
                }],
                estados:estadoResolve,
                isFromNovo: isFromNovoResolver,
                grupos: grupoClienteResolve
            },
            params: {
                isFromNovo: null
            }
        });


        $stateProvider.state('layout.clienteNovo', {
            id:'clientes',
            url: '^/cliente/novo',
            jurixPermissoes:'Cliente.Cadastrar',
            views:{
                content: {
                    template: formView,
                    controller: 'FormClienteController'
                },
                'menu-superior':{
                    template: formMenu
                }
            },
            resolve:{
                cliente: function(){
                    return {clienteFisico:{}, clienteJuridico:{}, municipio:{}, grupo:{}};
                },
                estados:estadoResolve,
                isFromNovo: isFromNovoResolver,
                grupos: grupoClienteResolve
            },
            params: {
                isFromNovo: null
            }
        });




    }]);
});