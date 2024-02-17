define(['../module', 'text!./view.html', 'jquery'], function (module, view, $) {
    'use strict';

    function addDays(date, days) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    module.directive('modalProrrogarEvento', ['pautaEventoService', function (pautaEventoService) {
        return {
            restrict: 'E',
            template: view,
            controller: ['$scope', function ($scope) {


                $scope.pautaEventoAtual = null;

                $scope.$on('ABRIR_PRORROGAR_PRAZO', function (ev, pautaEvento) {

                    $('#eventoProrrogarModal').modal('show');
                    $scope.pautaEventoAtual = pautaEvento;
                    $scope.diasAdicionar = 5;
                });

                $scope.adicionarDias = function () {
                    $scope.pautaEventoAtual.dataLimite = addDays($scope.pautaEventoAtual.dataLimite, $scope.diasAdicionar);

                    pautaEventoService.save($scope.pautaEventoAtual)
                        .then(function () {
                            $scope.$root.$broadcast('ON_PESQUISAR_EVENTO_PAUTA');
                            $('#eventoProrrogarModal').modal('hide');
                        });
                };

            }]
        };
    }]);
});