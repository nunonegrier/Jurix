define(['../module'], function (module) {
    'use strict';

    function updatePaginationFn($scope) {
        return function () {
            $scope.pesquisar();
        };
    }

    function pesquisarFn($scope, FiltroService) {
        return function () {

            FiltroService.findAll($scope.filtros).then(function (filtrosPage_) {
                setFiltros($scope, filtrosPage_);
            });
        }
    }

    function setFiltros($scope, filtrosPage) {

        $scope.pagesSize = [10, 25];

        $scope.filtroUsuarioPage = filtrosPage;
    }

    module.controller('favoritoRelatorioControler', ['$scope', '$state', 'tipoFiltro', 'filtroUsuarioPage', 'stateResultado', 'FiltroService',
        function ($scope, $state, tipoFiltro, filtroUsuarioPage, stateResultado, FiltroService) {


        $scope.filtros = {
            nomeDescricao: '',
            tipoFiltro: tipoFiltro,
            page: filtroUsuarioPage.number + 1,
            size: filtroUsuarioPage.size
        };

        setFiltros($scope, filtroUsuarioPage);

        $scope.pesquisar = pesquisarFn($scope, FiltroService);
        $scope.updatePagination = updatePaginationFn($scope);

        $scope.abrirModalDeletar = function (filtroUsuario) {

            $scope.filtroUsuarioDeletar = filtroUsuario;
            angular.element('#apagarRelatorioFavorito').modal('show');

        };

        $scope.confirmApagar = function () {

            FiltroService.delete($scope.filtroUsuarioDeletar.id)
                .then(function () {
                    angular.element('#apagarRelatorioFavorito').modal('hide');
                    $scope.pesquisar();
                });
        };

        $scope.getUrlResultado = function(filtroUsuario){
            return $state.href(stateResultado, {idFiltro:filtroUsuario.id});
        };

    }]);
});

