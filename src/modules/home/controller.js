/**
 * @author hebert ramos
 */
define(['./module'], function (module) {
    'use strict';

    module.controller('HomeController', ['$scope', '$state', 'SegurancaService', 'colaboradorService', 'dashBoard', function ($scope, $state, SegurancaService, colaboradorService, dashBoard) {

        $scope.dashBoard = dashBoard;

        $scope.exibirPautaGeral = function(){

            var possuiPermissaoPautaGeral = SegurancaService.possuiPermissao('Pauta.VisualizarGeral');
            var possuiPermissaoPauta = SegurancaService.possuiPermissao('Pauta.Visualizar');

            return !possuiPermissaoPauta && possuiPermissaoPautaGeral;
        };

        $scope.irPerfilUsuario = function(){
            $state.go('layout.colaboradorVisualizar', {id: $scope.colaborador.id});
        };

        colaboradorService.findAll({usuarioId: $scope.$root.usuarioAtual.id})
            .then(function(colaboradorPage){
                if(colaboradorPage.content[0]) {
                    $scope.colaborador = colaboradorPage.content[0];
                }else{
                    $scope.colaborador = null;
                }
            });

    }]);
});