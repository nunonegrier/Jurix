/**
 * @author hebert ramos
 */
define(['./module'], function (module) {
    'use strict';

    module.controller('UsuarioEditController', ['$scope', '$http', function ($scope, $http) {

        $scope.usuario = {
            email: '',
            senha: '',
            nome: ''
        };

        $scope.salvar = function(){

            $http.post('usuarios', $scope.usuario);

        };


    }]);
});