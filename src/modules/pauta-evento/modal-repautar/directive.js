define(['../module', 'text!./view.html', 'jquery'], function (module, view, $) {
    'use strict';

    function addDays(date, days) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    module.directive('modalRepautarEvento', ['pautaEventoService', function (pautaEventoService) {
        return {
            restrict: 'E',
            template: view,
            controller: ['$scope', function ($scope) {


                $scope.pautaEventoAtual = null;

                $scope.$on('REPAUTAR_EVENTO', function (ev, pautaEvento) {

                    $('#eventoRepautarModal').modal('show');
                    $scope.pautaEventoAtual = pautaEvento;
                    $scope.novaData = null;
                });

                $scope.saveRepautarEvento = function () {


                    if ($scope.novaData) {

                        $scope.pautaEventoAtual.dataLimite = $scope.novaData;

                        pautaEventoService.save($scope.pautaEventoAtual)
                            .then(function () {
                                $scope.$root.$broadcast('ON_PESQUISAR_EVENTO_PAUTA');
                                $('#eventoRepautarModal').modal('hide');
                            });
                    }
                };

            }]
        };
    }]);
});