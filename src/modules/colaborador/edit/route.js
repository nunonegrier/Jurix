define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, editView, editMenu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        var defaultState = {
            views: {
                content: {
                    template: editView,
                    controller: 'editColaboradorController'
                },
                'menu-superior': {
                    template: editMenu,
                    controller: 'editColaboradorController'
                }
            },
            resolve: {
                colaborador: ['$stateParams', 'colaboradorService', function ($stateParams, colaboradorService) {
                    if ($stateParams.id) {
                        return colaboradorService.findById($stateParams.id);
                    } else {
                        return {usuario: { perfil: {} }};
                    }
                }],
                perfis: ['colaboradorService', function (colaboradorService) {
                    return colaboradorService.buscarPerfis();
                }],
                isFromNovo: ['$stateParams', function ($stateParams) {
                    return $stateParams.isFromNovo;
                }]
            }
        };

        $stateProvider.state('layout.colaboradorNovo', {
            id: 'colaboradores',
            url: '^/colaboradores/novo',
            views: defaultState.views,
            jurixPermissoes:'Colaborador.Cadastrar',
            resolve: {
                colaborador: defaultState.resolve.colaborador,
                perfis: defaultState.resolve.perfis,
                isFromNovo: defaultState.resolve.isFromNovo,
                acao: function () {
                    return 'novo';
                }
            },
            params: {
                isFromNovo: null
            }
        });


        $stateProvider.state('layout.colaboradorEditar', {
            id: 'colaboradores',
            url: '^/colaboradores/:id/editar',
            jurixPermissoes:'Colaborador.Editar',
            views: defaultState.views,
            resolve: {
                colaborador: defaultState.resolve.colaborador,
                perfis: defaultState.resolve.perfis,
                isFromNovo: defaultState.resolve.isFromNovo,
                acao: function () {
                    return 'editar';
                }
            },
            params: {
                isFromNovo: null
            }
        });

        $stateProvider.state('layout.colaboradorVisualizar', {
            id: 'colaboradores',
            url: '^/colaboradores/:id/visualizar',
            views: defaultState.views,
            resolve: {
                colaborador: defaultState.resolve.colaborador,
                perfis: defaultState.resolve.perfis,
                isFromNovo: defaultState.resolve.isFromNovo,
                acao: function () {
                    return 'visualizar';
                }
            },
            params: {
                isFromNovo: null
            }
        });
    }]);
});