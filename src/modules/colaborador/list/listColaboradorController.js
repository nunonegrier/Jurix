define(['../module'], function (module) {
    'use strict';

    function setColaboradores($scope, colaboradores) {
        $scope.colaboradores = colaboradores;
    }

    function pesquisar($scope, colaboradorService) {
        return function () {
            colaboradorService.findAll({nome: $scope.nome, perfil:$scope.perfilSelecionado.id}).then(function (colaboradoresPage_) {
                setColaboradores($scope, colaboradoresPage_.content);
            });
        }
    }

    module.controller('listColaboradorController', ['$scope', 'colaboradoresPage', 'colaboradorService', 'perfis', function ($scope, colaboradoresPage, colaboradorService, perfis) {
        setColaboradores($scope, colaboradoresPage.content);

        $scope.pesquisar = pesquisar($scope, colaboradorService);

        $scope.perfis = perfis;

        $scope.perfilSelecionado = {};
    }]);
});

