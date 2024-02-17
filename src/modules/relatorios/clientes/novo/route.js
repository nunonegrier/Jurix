define(['../../module', 'text!./menu.html', 'text!./view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorioClienteNovo', {
            id:'relatorioClientess',
            url: '^/relatorio/cliente/novo',
            views:{
                content: {
                    template: view,
                    controller: 'novoRelatorioClienteControler'
                },
                'menu-superior':{
                    template: menu
                }
            },
            resolve:{
                estados:['LocalidadeService', function(LocalidadeService){
                    return LocalidadeService.buscarEstados({size:100});
                }],
                grupos: ['GrupoClienteService', function(GrupoClienteService){
                    return GrupoClienteService.buscarGrupos();
                }]
            }
        });

    }]);
});