define(['../module', 'text!./view.html', 'angular'], function (module, view, angular) {
        'use strict';

        function carregarTiposAndamento($scope, TipoAndamentoService) {

            TipoAndamentoService.findByFinalidade('FINALIZAR_PROCESSO')
                .then(function (tiposAndamento) {
                    $scope.tiposAndamento = tiposAndamento._embedded.tipoAndamento;
                });
        }

        function carregarResultadosProcesso($scope, ResultadoProcessoService) {

            ResultadoProcessoService.findAll({size: 1000})
                .then(function (resultadosProcesso) {
                    $scope.resultadosProcesso = resultadosProcesso._embedded.resultadoProcesso;
                });
        }

        function addFunctionsArquivos($scope, arquivos, FileService) {

            $scope.filesAndamento = arquivos;

            $scope.arquivoData = {
                file: null,
                description: null,
                repository: 'andamentoProcesso/novo'
            };

            FileService.addFunctionsToEscope($scope);

            $scope.uploadFileAndamento = function () {

                FileService.sendFileTemp($scope.arquivoData.file[0], $scope.arquivoData.repository, $scope.arquivoData.description)
                    .then(function (fileTemp) {

                        fileTemp.data.description = fileTemp.data.name;
                        $scope.filesAndamento.push(fileTemp.data);
                    });


            };

            $scope.setArquivoARemover = function (idFileMetadata) {
                $scope.idFileMetadata = idFileMetadata;
            };

            $scope.removerArquivo = function () {

                FileService.setFileRemoved($scope.idFileMetadata)
                    .then(function () {

                        angular.element('#apagarArquivoModal').modal('hide');


                        removerArquivoList($scope, $scope.idFileMetadata);
                    });

            };
        }

        function isFormsValidos($scope, formAdamento) {
            return formAdamento.checkValidity()
        }

        function addClassValidatedForms($scope, formAdamento) {
            formAdamento.classList.add('was-validated');
        }

        function atualizarArquivosTemporarios($scope, $q, andamentoProcessoSalvo, FileService) {

            var filesToSave = $scope.filesAndamento.filter(function (fileContrato) {
                return fileContrato.state === 'TEMPORARY';
            });

            var prom = [];

            filesToSave.forEach(function (fileToSave) {
                fileToSave.destFolder = getFolderPath(andamentoProcessoSalvo);

                prom.push(FileService.setDefinitive(fileToSave));
            });

            return $q.all(prom)

        }

        function salvarAgendamentoFn($scope, $q, AndamentoService, FileService) {
            return function () {

                var formAdamento = angular.element('#processoEventoFormFinalizacao')[0];

                if (isFormsValidos($scope, formAdamento)) {

                    AndamentoService.save($scope.andamentoProcesso)
                        .then(function (andamentoProcessoSalvo) {

                            $scope.andamentoProcesso = andamentoProcessoSalvo;

                            atualizarArquivosTemporarios($scope, $q, andamentoProcessoSalvo, FileService)
                                .then(function () {
                                    angular.element('#processoAndamentoFinalizar').modal("hide");
                                    $scope.$root.$broadcast('FINALIZAR_PROCESSO');
                                });
                        });
                } else {
                    //exibirMsgCamposObrigatorios($scope);
                }

                addClassValidatedForms($scope, formAdamento)
            };
        }

        function getNovoAndamentoProcesso($scope, processo, SegurancaService) {
            var novoAndamentoProcesso = {
                data: new Date(),
                processo: processo,
                tipoAndamento: {},
                resultadoProcesso: {},
                descricao: null,
                criaEventoPauta: false,
                pautaEvento: null
            };

            return novoAndamentoProcesso;
        }

        function addHandlers($scope, FileService, SegurancaService) {

            $scope.$on('NOVO_ANDAMENTO_PROCESSO_FINALIZAR', function (ev, processo) {
                var visualizacao = false;
                abrirModalAndamentoProcesso(getNovoAndamentoProcesso($scope, processo, SegurancaService), visualizacao, $scope, FileService);
                angular.element('#processoEventoForm')[0].reset();
                angular.element('#formAndamentoPautaEvento')[0].reset();
            });

            $scope.$on('VISUALIZAR_ANDAMENTO_PROCESSO_FINALIZAR', function (ev, andamentoProcesso) {

                var visualizacao = true;
                abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope, FileService);
            });
        }

        function carregarArquivosAndamento(andamentoProcesso, $scope, FileService) {

            FileService.listFiles(getFolderPath(andamentoProcesso))
                .then(function (folder) {
                    if (folder) {
                        $scope.filesAndamento = folder.childrens;
                    } else {
                        $scope.filesAndamento = [];
                    }
                });
        }

        function getFolderPath(andamentoProcessoSalvo) {
            return 'processo/' + andamentoProcessoSalvo.processo.id + '/andamentoProcesso/' + andamentoProcessoSalvo.id;
        }

        function setProcessoId(andamentoProcesso) {
            andamentoProcesso.processoId = andamentoProcesso.processo.id;
        }

        function abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope, FileService) {

            $scope.visualizacao = visualizacao;

            $scope.andamentoProcesso = andamentoProcesso;

            if (andamentoProcesso.id) {
                carregarArquivosAndamento(andamentoProcesso, $scope, FileService);
            }

            setProcessoId(andamentoProcesso);

            angular.element('#processoAndamentoFinalizar').modal("show");
        }

        module.directive('finalizacaoProcesso', ['TipoAndamentoService', 'FileService', 'AndamentoService', 'SegurancaService', 'ResultadoProcessoService',
            function (TipoAndamentoService, FileService, AndamentoService, SegurancaService, ResultadoProcessoService) {

                return {
                    restrict: 'E',
                    template: view,
                    scope: {},
                    controller: ['$scope', '$q', function ($scope, $q) {

                        addHandlers($scope, FileService, SegurancaService);

                        carregarTiposAndamento($scope, TipoAndamentoService);

                        carregarResultadosProcesso($scope, ResultadoProcessoService);

                        addFunctionsArquivos($scope, [], FileService);

                        $scope.salvarAndamentoFinalizacao = salvarAgendamentoFn($scope, $q, AndamentoService, FileService);
                    }]
                };
            }]);
    }
);