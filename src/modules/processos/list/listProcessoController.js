define(['../module'], function (module) {
    'use strict';

    function setProcessos($scope, processosPage) {

        $scope.pagesSize = [10, 25];

        $scope.processosPage = processosPage;
        $scope.processos = processosPage.content;
    }

    function pesquisarFn($scope, ProcessoService) {
        return function (reiniciarPaginacao) {

            ProcessoService.filtroBusca.numeroDescricaoBusca = $scope.filtros.numeroDescricao;
            ProcessoService.filtroBusca.situacao = $scope.filtros.situacao;
            ProcessoService.filtroBusca.page = reiniciarPaginacao ? 1 : $scope.filtros.page;

            ProcessoService.findAll($scope.filtros).then(function (processoPage_) {
                setProcessos($scope, processoPage_);
            });
        }
    }

    function novoAndamentoFn($scope) {
        return function (processo) {
            $scope.$root.$broadcast('NOVO_ANDAMENTO_PROCESSO', processo);
        };
    }

    function novoAndamentoFinalizarFn($scope) {
        return function (processo) {
            $scope.$root.$broadcast('NOVO_ANDAMENTO_PROCESSO_FINALIZAR', processo);
        };
    }

    function novoAndamentoReativarFn($scope) {
        return function (processo) {
            $scope.$root.$broadcast('NOVO_ANDAMENTO_PROCESSO_REATIVAR', processo);
        };
    }

    function addHandlers($scope) {

        $scope.$on('REATIVAR_PROCESSO', function () {
            $scope.pesquisar();
        });

        $scope.$on('FINALIZAR_PROCESSO', function () {
            $scope.pesquisar();
        });
    }

    function updatePaginationFn($scope, ProcessoService) {
        return function () {
            pesquisarFn($scope, ProcessoService)();
        };
    }

    function deletarProcessoFn($scope, ProcessoService){
        return function(){

            ProcessoService.delete($scope.processo.id).then(function () {
                $scope.$root.$broadcast('ESCONDER_MODAL_CONFIRMACAO_DELETAR_PROCESSO');
                $scope.pesquisar();
            });
        };
    }

    function atribuirDeletarProcessoFn($scope){
        return function(processo){
            $scope.processo = processo;
            $scope.$root.$broadcast('EXIBIR_MODAL_CONFIRMACAO_DELETAR_PROCESSO');
        }
    }

    module.controller('listProcessoController', ['$scope', 'processosPage', 'ProcessoService', 'jurixConstants', function ($scope, processosPage, ProcessoService, jurixConstants) {
        setProcessos($scope, processosPage);
        addHandlers($scope);

        $scope.filtros = {
            numeroDescricao: ProcessoService.filtroBusca.numeroDescricaoBusca,
            situacao:ProcessoService.filtroBusca.situacao,
            page: processosPage.number + 1,
            size: processosPage.size
        };

        $scope.situacoesProcesso = jurixConstants.ENUM.EnumSituacaoProcesso;

        $scope.novoAndamento = novoAndamentoFn($scope);

        $scope.novoAndamentoFinalizar = novoAndamentoFinalizarFn($scope);

        $scope.novoAndamentoReativar = novoAndamentoReativarFn($scope);

        $scope.pesquisar = pesquisarFn($scope, ProcessoService);

        $scope.updatePagination = updatePaginationFn($scope, ProcessoService);

        $scope.atribuirDeletarProcesso = atribuirDeletarProcessoFn($scope);

        $scope.deletarProcesso = deletarProcessoFn($scope, ProcessoService);
    }]);
});

