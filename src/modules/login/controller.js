/**
 * @author hebert ramos
 */
define(['./module'], function (module) {
    'use strict';

    module.controller('LoginController', ['$scope', '$stateParams', '$http', 'loggedUserService', function ($scope, $stateParams, $http, loggedUserService) {

        $scope.recuperarSenha = {};
        if(loggedUserService.getUser()){

            $scope.$root.$broadcast('GO_TO_HOME_PAGE');
            return;
        }

        $scope.hasError = $stateParams.error;

        $scope.enviarRecuperarSenha = function(){

             $http.post('/usuarios/gerarToken', $scope.recuperarSenha)
                                .then(function successCallback(response) {
                                    alert('Foi enviado email para recuperação de senha com sucesso!!.')
                                }, function errorCallback(resp) {
                                    var msg = 'Não foi possível recuperar a senha.'
                                    if(resp.data && resp.data.message){
                                        msg = resp.data.message;
                                    }
                                    alert(msg);
                                });
        };

    }]);
});