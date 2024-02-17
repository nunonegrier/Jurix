define(['../module', 'text!./view.html', 'angular'], function (module, view, angular) {
        'use strict';


        function salvarAdamentoFn($scope, $q, AndamentoService) {
            return function () {

                AndamentoService.salvarAndamentoReativacao($scope.andamentoProcesso)
                    .then(function () {

                        angular.element('#processoAndamentoReativar').modal("hide");

                        $scope.$root.$broadcast('REATIVAR_PROCESSO');
                    });
            };
        }

        function getNovoAndamentoProcesso($scope, processo) {
            var novoAndamentoProcesso = {
                data: new Date(),
                processo: processo,
                tipoAndamento: {},
                resultadoProcesso: null,
                descricao: null,
                criaEventoPauta: false,
                pautaEvento: null
            };

            return novoAndamentoProcesso;
        }

        function addHandlers($scope) {

            $scope.$on('NOVO_ANDAMENTO_PROCESSO_REATIVAR', function (ev, processo) {
                var visualizacao = false;
                abrirModalAndamentoProcesso(getNovoAndamentoProcesso($scope, processo), visualizacao, $scope);
            });

            $scope.$on('VISUALIZAR_ANDAMENTO_PROCESSO_REATIVAR', function (ev, andamentoProcesso) {

                var visualizacao = true;
                abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope);
            });
        }

        function setProcessoId(andamentoProcesso) {
            andamentoProcesso.processoId = andamentoProcesso.processo.id;
        }

        function abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope) {

            $scope.visualizacao = visualizacao;

            $scope.andamentoProcesso = andamentoProcesso;

            setProcessoId(andamentoProcesso);

            angular.element('#processoAndamentoReativar').modal("show");
        }

        module.directive('reativarProcesso', ['AndamentoService',
            function (AndamentoService) {

                return {
                    restrict: 'E',
                    template: view,
                    scope: {},
                    controller: ['$scope', '$q', function ($scope, $q) {

                        addHandlers($scope);

                        $scope.salvarAndamentoReativar = salvarAdamentoFn($scope, $q, AndamentoService);
                    }]
                };
            }]);
    }
);