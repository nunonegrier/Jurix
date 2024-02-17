define(['../module', 'text!./view.html', 'text!./menu.html'], function (app, editView, visualizarMenu) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        var viewsVisualizar = {
            content: {
                template: editView,
                controller: 'visualizarProcessoController'
            },
            'menu-superior': {
                template: visualizarMenu,
                controller: 'visualizarProcessoController'
            }
        };


        var resolveBase = {

            processoDto: ['$stateParams', 'ProcessoService', function ($stateParams, ProcessoService) {

                return ProcessoService.findByIdMarcaRecente($stateParams.id);

            }],
            andamentos: ['$stateParams', 'AndamentoService', function ($stateParams, AndamentoService) {
                return AndamentoService.findAll({processoId: $stateParams.id});
            }],
            arquivosAndamento: ['$stateParams', '$q', 'andamentos', 'FileService', function ($stateParams, $q, andamentos, FileService) {

                if (andamentos.length == 0) {
                    return {arquivos: []};
                }

                var prom = [];

                andamentos.forEach(function (andamentoProcesso) {
                    var folderPath = 'processo/' + $stateParams.id + '/andamentoProcesso/' + andamentoProcesso.id;

                    prom.push(FileService.listFiles(folderPath)
                        .then(function (folder) {
                            if (folder) {
                                return  {andamentoProcesso: andamentoProcesso, arquivos: folder.childrens};
                            }
                            return {arquivos: []};
                        }));
                });

                return $q.all(prom)

            }],
            arquivosContrato: ['$stateParams', 'processoDto', 'FileService', function ($stateParams, processoDto, FileService) {

                return FileService.listFiles('contrato/' + processoDto.processo.contrato.id).then(function(folder){
                    if(folder){
                        return folder.childrens;
                    }
                    return [];
                });

            }],
            arquivosPauta: ['$stateParams', '$q', 'FileService', function ($stateParams, $q, FileService) {

                return FileService.listFiles('processo/' + $stateParams.id + '/pautaEvento').then(function(pastaPautaEventos){
                    if(pastaPautaEventos){

                        var prom = [];

                        pastaPautaEventos.childrens.forEach(function (pastaPautaEvento) {
                            var folderPath = 'processo/' + $stateParams.id + '/pautaEvento/' + pastaPautaEvento.name;

                            prom.push(FileService.listFiles(folderPath)
                                .then(function (folder) {
                                    if (folder) {
                                        return  {eventoPauta: 'Evento de Pauta', arquivos: folder.childrens};
                                    }
                                    return {arquivos: []};
                                }));
                        });

                        return $q.all(prom)
                    }
                    return [];
                });

            }],
            processosFilho: ['$stateParams', 'ProcessoService', function ($stateParams, ProcessoService) {

                return ProcessoService.findAll({processoPaiId: $stateParams.id})
                    .then(function(processoPage){
                        return processoPage.content;
                    });

            }]
        };

        $stateProvider.state('layout.processoVisualizar', {
            id: 'processos',
            url: '^/processos/view/:id',
            jurixPermissoes:'Processo.Visualizar',
            views: viewsVisualizar,
            resolve: resolveBase,
            params: {
                rotaVoltarPara:null,
                paramsVoltarPara:null
            }
        });

    }]);
});