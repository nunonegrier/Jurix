define(['../../module', 'text!./view.html', 'angular'], function (module, view, angular) {
    'use strict';
    module.directive('partesProcesso', [function () {
        return {
            restrict: 'E',
            template: view,
            scope: {
                partes: '=',
                partesRemover: '=',
                desabilitarAdicionar: '='
            },
            controller: ['$scope', 'PosicaoParteService', function ($scope, PosicaoParteService) {

                PosicaoParteService.findAll({size:100})
                    .then(function (posicoesPage) {
                        $scope.posicoesParte = posicoesPage._embedded.posicaoParte;
                        $scope.posicoesParteCliente = angular.copy($scope.posicoesParte);
                        $scope.posicoesParteCliente.push({
                            id:-1,
                            descricao: 'Cliente'
                        })
                    });

                $scope.partes.forEach(function(parte){
                   if(parte.cliente){
                       parte.posicaoParte ={id: -1};
                   }
                });

                $scope.addParte = function () {
                    $scope.partes.push({
                        nome: null,
                        contato: null,
                        posicaoParte: {},
                        desabilitado: false
                    });
                };

                $scope.removerParte = function(index){

                    if($scope.partes[index].id){
                        $scope.partesRemover.push($scope.partes[index]);
                    }

                    $scope.partes.splice(index, 1);
                };

            }]
        };
    }]);
});