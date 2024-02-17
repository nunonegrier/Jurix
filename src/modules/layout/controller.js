/**
 * @author hebert ramos
 */
define(['./module'], function (app) {
    'use strict';

    app.filter('noHTML', function () {
        return function(text) {
            if(text) {
                return text
                    .replace(/&/g, '&amp;')
                    .replace(/>/g, '&gt;')
                    .replace(/</g, '&lt;');
            }
            return text;
        }
    });

    app.filter('newlines', function ($sce) {
        return function(text) {
            if(text) {
                return $sce.trustAsHtml(text.replace(/\n/g, '<br/>'));
            }
            return text;
        }
    });

    return app.controller('LayoutController', ['$scope', '$state', '$window', 'usuarioAtual', 'colaboradorService',
        function ($scope, $state, $window, usuarioAtual, colaboradorService) {

        $scope.$root.usuarioAtual = usuarioAtual;

        $scope.irPerfilUsuario = function(){
            colaboradorService.findAll({usuarioId: usuarioAtual.id})
                .then(function(colaboradorPage){
                    if(colaboradorPage.content[0]) {
                        $state.go('layout.colaboradorVisualizar', {id: colaboradorPage.content[0].id});
                    }
                });
        };

        $scope.$root.goBack = function(){
                $window.history.back();
        }

    }]);
});