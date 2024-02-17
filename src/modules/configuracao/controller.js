/**
 * @author hebert ramos
 */
define(['./module'], function (module) {
    'use strict';

    module.controller('ConfiguracaoController', ['$scope', 'perfis', 'permissoes', 'parametroIndexador', function ($scope, perfis, permissoes, parametroIndexador) {

        $scope.perfis = perfis;
        $scope.permissoes = permissoes;
        $scope.parametroIndexador = parametroIndexador;
    }]);
});