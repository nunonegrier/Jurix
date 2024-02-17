/**
 * @author hebert ramos
 */
define(['../module', 'angular'], function (module, angular) {
    'use strict';

    function setClientes($scope, clientes){
        $scope.clientes = clientes;
    }

    module.controller('ListClienteController', ['$scope', 'clientesPage', 'grupos', 'ClienteService', function ($scope, clientesPage, grupos, ClienteService) {


        $scope.grupos = grupos;

        setClientes($scope, clientesPage.content);

        $scope.filtro = {nome:null, grupo:null};

        $scope.pesquisar = function(){
            ClienteService.findAll($scope.filtro)
                .then(function(clientesPage_){
                    setClientes($scope, clientesPage_.content);
                });
        };

        angular.element('#campoBusca').focus();

        $scope.getEmailCliente = function(cliente){
            if(cliente.email){
                return cliente.email;
            }else{
                if(cliente.clienteFisico){
                    return cliente.clienteFisico.emailProfissional;
                }
                return cliente.clienteJuridico.emailResponsavel;
            }
        }

        $scope.limparGrupo = function(){
            $scope.filtro.grupo = null;
            $scope.pesquisar();
        };

    }]);
});