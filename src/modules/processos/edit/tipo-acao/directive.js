define(['../../module', 'text!./view.html', 'angular'], function (module, view, angular) {
    'use strict';
    module.directive('addTipoAcao', ['TipoAcaoService', function (TipoAcaoService) {

        function getNovoTipoAcao() {
            return {
                descricao: null,
                removido: false
            };
        }

        return {
            restrict: 'E',
            template: view,
            scope: {},
            controller: ['$scope', function ($scope) {

                $scope.$on('ADD_TIPO_ACAO', function () {
                    $scope.tipoAcao = getNovoTipoAcao();
                    angular.element('#adicionarTipoAcao').modal("show");
                });

                $scope.salvarTipoAcao = function () {

                    var form = angular.element('#formTipoAcao')[0];

                    if (form.checkValidity()) {

                        TipoAcaoService.save($scope.tipoAcao)
                            .then(function (tipoAcaoSalvo) {
                                $scope.$root.$broadcast('AFTER_ADD_TIPO_ACAO', tipoAcaoSalvo);
                                angular.element('#adicionarTipoAcao').modal("hide");
                            });
                    }
                };

            }]
        };
    }]);
});