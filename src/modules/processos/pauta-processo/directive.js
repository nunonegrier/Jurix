define(['../module', 'text!./view.html', 'angular'], function (module, view, angular) {
        'use strict';


        function getNovoPautaEventoProcesso($scope, processo) {
            var novaPautaEvento =  {
                processo: processo
            };

            if(!$scope.podeCriarEventoColaboradores){
                novaPautaEvento.colaborador = {id: $scope.colaboradores[0].id}
            }

            return novaPautaEvento;
        }


        function addHandlers($scope) {

            $scope.$on('NOVO_PAUTA_PROCESSO', function (ev, processo) {

                $scope.pautaEvento = getNovoPautaEventoProcesso($scope, processo);
                angular.element('#pautaEventoProcessoModal').modal("show");
            });

        }


        function salvarPautaEventoFn($scope, pautaEventoService) {
            return function () {
                var form = angular.element('#formularioPautaEvento')[0];

                if (form.checkValidity()) {
                    pautaEventoService.save($scope.pautaEvento)
                        .then(function () {
                            angular.element('#pautaEventoProcessoModal').modal("hide");
                        });
                } else {
                    exibirMsgCamposObrigatorios($scope);
                }
            }
        }

        function exibirMsgCamposObrigatorios($scope) {
            $scope.$root.$broadcast('ERRO_CAMPOS_OBRIGATORIOS');
        }


        function carregarColaboradores($scope, colaboradorService) {

            if($scope.podeCriarEventoColaboradores) {
                colaboradorService.findAll()
                    .then(function (colaboradoresPage) {
                        $scope.colaboradores = colaboradoresPage.content;
                    });
            }else{
                colaboradorService.findAll({usuarioId: $scope.$root.usuarioAtual.id})
                    .then(function (colaboradoresPage) {
                        $scope.colaboradores = colaboradoresPage.content;
                    });
            }
        }

        module.directive('pautaEventoProcessoForm', ['colaboradorService', 'pautaEventoService', 'SegurancaService',
            function (colaboradorService, pautaEventoService, SegurancaService) {

                return {
                    restrict: 'E',
                    template: view,
                    scope: {},
                    controller: ['$scope', function ($scope) {

                        $scope.podeCriarEventoColaboradores = SegurancaService.possuiPermissao('Pauta.Criar.ParaColaboradores');

                        addHandlers($scope);

                        carregarColaboradores($scope, colaboradorService);

                        $scope.salvarPautaEvento = salvarPautaEventoFn($scope, pautaEventoService);
                    }]
                };
            }]);
    }
);