/**
 * @author hebert ramos
 */
define(['../module', 'angular'], function (module) {
    'use strict';


    module.controller('ContratoMenuController', ['$scope', 'contrato', 'visualizar',
        function ($scope, contrato, visualizar) {

            $scope.visualizar = visualizar;
            $scope.contrato = contrato;
        }]);
});