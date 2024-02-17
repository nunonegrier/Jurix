define(['../module', 'lodash'], function (module, _) {
    'use strict';


    function setProcesso($scope, processoDto) {
        $scope.processoDto = processoDto;
    }

    function setAndamentos($scope, andamentos) {
        $scope.andamentos = andamentos;
    }

    function novoAndamentoFn($scope, processoDto) {
        return function () {
            $scope.$root.$broadcast('NOVO_ANDAMENTO_PROCESSO', processoDto.processo);
        };
    }


    function novoAndamentoFinalizarFn($scope, processoDto){
        return function(){
            $scope.$root.$broadcast('NOVO_ANDAMENTO_PROCESSO_FINALIZAR', processoDto.processo);
        };
    }

    function novoAndamentoReativarFn($scope, processoDto){
        return function(){
            $scope.$root.$broadcast('NOVO_ANDAMENTO_PROCESSO_REATIVAR', processoDto.processo);
        };
    }

    function visualizarAndamentoFn($scope) {
        return function (andamentoProcesso) {

            if(andamentoProcesso.tipoAndamento.finalidade == 'ANDAMENTO') {
                $scope.$root.$broadcast('VISUALIZAR_ANDAMENTO_PROCESSO', andamentoProcesso);
            }else if(andamentoProcesso.tipoAndamento.finalidade == 'FINALIZAR_PROCESSO') {
                $scope.$root.$broadcast('VISUALIZAR_ANDAMENTO_PROCESSO_FINALIZAR', andamentoProcesso);
            }
        };
    }

    function editarAndamentoFn($scope) {
        return function (andamentoProcesso) {
            $scope.$root.$broadcast('EDITAR_ANDAMENTO_PROCESSO', andamentoProcesso);
        };
    }


    function novoPautaEventoProcessoFn($scope, processoDto) {
        return function () {
            $scope.$root.$broadcast('NOVO_PAUTA_PROCESSO', processoDto.processo);
        };
    }

    function setArquivosAndamento($scope, $filter, arquivosAndamento) {
        if (arquivosAndamento.length > 0) {
            arquivosAndamento.forEach(function (listArquivoAndamento) {
                if (listArquivoAndamento.arquivos.length > 0) {
                    listArquivoAndamento.arquivos.forEach(function (arquivoAndamento) {
                        $scope.arquivos.push({
                            data: arquivoAndamento.createDate,
                            nome: arquivoAndamento.name,
                            descricao: arquivoAndamento.description,
                            origem: 'Andamento ' + $filter('date')(listArquivoAndamento.andamentoProcesso.data, "dd/MM/yyyy"),
                            link: 'arquivos/download?uri=' + arquivoAndamento.destFolder + '/' + arquivoAndamento.name,
                            origemLink: function () {
                                $scope.visualizarAndamento(listArquivoAndamento.andamentoProcesso);
                            }
                        });
                    });
                }
            });
        }
    }

    function setArquivosContrato($scope, $state, arquivosContrato) {
        if (arquivosContrato.length > 0) {
            arquivosContrato.forEach(function (arquivoContrato) {
                $scope.arquivos.push({
                    data: arquivoContrato.createDate,
                    nome: arquivoContrato.name,
                    descricao: arquivoContrato.description,
                    origem: 'Contrato ' + $scope.processoDto.processo.contrato.descricao,
                    link: 'arquivos/download?uri=' + arquivoContrato.destFolder + '/' + arquivoContrato.name,
                    origemLink: function () {
                        $state.go('layout.clienteContratoVisualizar', {
                            clienteId: $scope.processoDto.processo.contrato.cliente.id,
                            id: $scope.processoDto.processo.contrato.id
                        });
                    }
                });
            });
        }
    }

    function setArquivosPauta($scope, $filter, arquivosPauta){
        if (arquivosPauta.length > 0) {
            arquivosPauta.forEach(function (listArquivoPauta) {
                if (listArquivoPauta.arquivos.length > 0) {
                    listArquivoPauta.arquivos.forEach(function (arquivoPauta) {
                        $scope.arquivos.push({
                            data: arquivoPauta.createDate,
                            nome: arquivoPauta.name,
                            descricao: arquivoPauta.description,
                            origem: 'Evento de Pauta',
                            link: 'arquivos/download?uri=' + arquivoPauta.destFolder + '/' + arquivoPauta.name
                        });
                    });
                }
            });
        }
    }

    function setArquivos($scope, $filter, $state, arquivosAndamento, arquivosContrato, arquivosPauta) {
        $scope.arquivos = [];

        setArquivosAndamento($scope, $filter, arquivosAndamento);

        setArquivosContrato($scope, $state, arquivosContrato);

        setArquivosPauta($scope, $filter, arquivosPauta);

    }

    function setProcessosFilho($scope, processosFilho) {
        $scope.processosFilho = processosFilho;
    }

    function setArquivoAndamentoRemoverFn($scope) {
        return function (andamento) {
            $scope.andamentoRemover = andamento;
        };
    }

    function removerAndamentoFn($scope, AndamentoService) {
        return function () {
            AndamentoService.delete($scope.processoDto.processo.id, $scope.andamentoRemover.id)
                .then(function () {
                    return AndamentoService.findAll({processoId: $scope.processoDto.processo.id});
                })
                .then(function (andamentos) {
                    setAndamentos($scope, andamentos);
                    angular.element('#apagarAndamentoModal').modal("hide");
                });
        };
    }

    function addHandlers($scope, $state, AndamentoService) {
        $scope.$on('SALVAR_ANDAMENTO', function () {
            AndamentoService.findAll({processoId: $scope.processoDto.processo.id})
                .then(function (andamentos) {
                    setAndamentos($scope, andamentos);
                });
        });

        $scope.$on('REATIVAR_PROCESSO', function(){
            $state.reload();
        });

        $scope.$on('FINALIZAR_PROCESSO', function(){
            $state.reload();
        });
    }

    function setActionsSateVoltar($scope, $state){
        $scope.rotaVoltarPara = $state.params.rotaVoltarPara;
        $scope.paramsVoltarPara = $state.params.paramsVoltarPara;

        $scope.getStateVoltar = function(){

            if($scope.rotaVoltarPara){
                var urlState = $scope.rotaVoltarPara;
                if($scope.paramsVoltarPara) {
                    urlState += '(' + JSON.stringify($scope.paramsVoltarPara) +')';
                }
                return urlState;
            }

            return 'layout.processoList({manterParametroBusca:true})';
        };
    }

    function deletarProcessoFn($scope, $state, processoDto, ProcessoService){
        return function(){

            ProcessoService.delete(processoDto.processo.id).then(function () {
                $scope.$root.$broadcast('ESCONDER_MODAL_CONFIRMACAO_DELETAR_PROCESSO');
                setTimeout(function(){
                    $state.go('layout.processoList');
                }, 500);
            });
        };
    }

    module.controller('visualizarProcessoController', ['$scope', '$filter', '$state', 'processoDto', 'andamentos', 'arquivosAndamento', 'arquivosContrato', 'arquivosPauta', 'processosFilho', 'AndamentoService', 'ProcessoService',
        function ($scope, $filter, $state, processoDto, andamentos, arquivosAndamento, arquivosContrato, arquivosPauta, processosFilho, AndamentoService, ProcessoService) {

            setActionsSateVoltar($scope, $state);
            setProcesso($scope, processoDto);
            setAndamentos($scope, andamentos);
            setArquivos($scope, $filter, $state, arquivosAndamento, arquivosContrato, arquivosPauta);
            setProcessosFilho($scope, processosFilho);

            $scope.dateOptions = {
                changeYear: true,
                changeMonth: true,
                yearRange: '1900:-0'
            };

            $scope.novoAndamento = novoAndamentoFn($scope, processoDto);
            $scope.novoAndamentoFinalizar = novoAndamentoFinalizarFn($scope, processoDto);
            $scope.novoAndamentoReativar = novoAndamentoReativarFn($scope, processoDto);

            $scope.visualizarAndamento = visualizarAndamentoFn($scope);
            $scope.editarAndamento = editarAndamentoFn($scope);
            $scope.novoPautaEventoProcesso = novoPautaEventoProcessoFn($scope, processoDto);
            $scope.setArquivoAndamentoRemover = setArquivoAndamentoRemoverFn($scope);
            $scope.removerAndamento = removerAndamentoFn($scope, AndamentoService);

            $scope.exibirAvisoDeletar = function(){
                $scope.$root.$broadcast('EXIBIR_MODAL_CONFIRMACAO_DELETAR_PROCESSO');
            };
            $scope.deletarProcesso = deletarProcessoFn($scope, $state, processoDto, ProcessoService);

            addHandlers($scope, $state, AndamentoService);
        }]);
});

