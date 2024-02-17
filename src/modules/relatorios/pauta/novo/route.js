define(['../../module', 'text!./menu.html', 'text!./view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioPautaNovo', {
            id:'relatorioPautas',
            url: '^/relatorio/pauta/novo',
            views:{
                content: {
                    template: view,
                    controller: 'novoRelatorioPautaControler'
                },
                'menu-superior':{
                    template: menu
                }
            },
            resolve:{
                colaboradoresPage: ['colaboradorService', 'SegurancaService', 'usuarioAtual', function (colaboradorService, SegurancaService, usuarioAtual) {
                    if (SegurancaService.possuiPermissao('Pauta.Criar.ParaColaboradores')) {
                        return colaboradorService.findAll();
                    }

                    return colaboradorService.findAll({usuarioId: usuarioAtual.id});
                }]
            }
        });

    }]);
});