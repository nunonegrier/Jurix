define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, listView, listMenu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.processoList', {
            id:'processos',
            url: '^/processos',
            jurixPermissoes:'Processo.Visualizar',
            views:{
                content: {
                    template: listView,
                    controller: 'listProcessoController'
                },
                'menu-superior':{
                    template: listMenu
                }
            },
            params: {
                manterParametroBusca: false
            },
            resolve:{
                processosPage:['ProcessoService', '$stateParams', function(ProcessoService, $stateParams){

                    var params = {size:10};

                    if ($stateParams.manterParametroBusca) {
                        params.numeroDescricao = ProcessoService.filtroBusca.numeroDescricaoBusca;
                        params.page = ProcessoService.filtroBusca.page;
                    }else{
                        ProcessoService.iniFiltroBusca();
                    }

                    return ProcessoService.findAll(params);
                }]
            }
        });

    }]);
});