/**
 * @author hebert ramos
 */
define(['./module'], function (module) {
    'use strict';

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    module.controller('RecuperarSenhaController', ['$scope', '$stateParams', '$http', '$state', function ($scope, $stateParams, $http, $state) {

        $scope.recuperarSenha = {
            token: $stateParams.token
        };

        $scope.atribuirNovaSenha = function(){

            if(isEmpty($scope.recuperarSenha.senha) || isEmpty($scope.recuperarSenha.repetirSenha)){
                alert('As senhas não foram preenchidas.');
                return;
            }

            if($scope.recuperarSenha.senha != $scope.recuperarSenha.repetirSenha){
                alert('As senhas não coincidem');
                return;
            }

            $http.post('/usuarios/atribuirNovaSenha', $scope.recuperarSenha)
            .then(function successCallback(response) {
                alert('Senha alterado com sucesso!!');
                 $state.go('login');
            }, function errorCallback(resp) {
                var msg = 'Não foi possível alterar a senha.'
                if(resp.data && resp.data.message){
                    msg = resp.data.message;
                }
                alert(msg);

            });
        };
    }]);
});