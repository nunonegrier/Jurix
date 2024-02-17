define(['../module', 'text!./view.html'], function (module, view) {
        'use strict';

        function initDadosSenha($scope){

            inciarMsgs($scope);

            $scope.dadosSenha = {
                senhaAtual:null,
                novaSenha:null,
                novaSenhaConfirmacao:null
            };
        }

        function inciarMsgs($scope){
            $scope.msgErroSenha = null;
            $scope.msgSucesso = null;
        }

        function addhandler($scope){

            $scope.$on('ALTERAR_SENHA', function(){

                initDadosSenha($scope);
                visualizarModal();
            });
        }

        function visualizarModal(){
            angular.element('#trocarSenha').modal("show");
        }

        function alterarSenhaFn($scope, $http){

            return function(){

                inciarMsgs($scope);

                if(!$scope.dadosSenha.senhaAtual || !$scope.dadosSenha.novaSenha || !$scope.dadosSenha.novaSenhaConfirmacao){
                    $scope.msgErroSenha = 'A nova senha não é válida.';
                    return;
                }

                if($scope.dadosSenha.novaSenha !== $scope.dadosSenha.novaSenhaConfirmacao){
                    $scope.msgErroSenha = 'A senha não é igual a confirmação.';
                    return;
                }

                $http.put('usuarios/atualizarSenha', $scope.dadosSenha)
                    .then(function(){
                        $scope.msgSucesso = true;
                    }, function(err){
                        $scope.msgErroSenha = err.data.message;
                    });
            };
        }

        module.directive('trocarSenhaUsuario', [
            function () {

                return {
                    restrict: 'E',
                    template: view,
                    scope: {},
                    controller: ['$scope', '$http', function ($scope, $http) {

                        addhandler($scope);

                        $scope.alterarSenha = alterarSenhaFn($scope, $http);
                    }]
                };
            }]);
    }
);