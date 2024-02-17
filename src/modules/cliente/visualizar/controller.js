/**
 * @author hebert ramos
 */
define(['../module'], function (module) {

    'use strict';

    function pesquisarProcessoFn($scope, ProcessoService){
        return function(){
            ProcessoService.findAll({clienteId: $scope.cliente.id, numeroDescricao: $scope.campoBuscaProcesso})
                .then(function(processoPage){
                    $scope.processos = processoPage.content;
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                });
        };
    }

    module.controller('ViauzliarClienteController', ['$scope', '$state', 'cliente', 'contratos', 'processos', 'ClienteService', 'FileService', 'ProcessoService',
        function ($scope, $state, cliente, contratos, processos, ClienteService, FileService, ProcessoService) {

            $scope.cliente = cliente;

            $scope.contratos = contratos;

            $scope.processos = processos;

            $scope.tiposFundacao = ClienteService.tiposFundacao;

            $scope.sexos = ClienteService.sexos;

            $scope.estadosCivil = ClienteService.estadosCivil;

            $scope.tiposEstadoCivil = ClienteService.tiposEstadoCivil;

            $scope.arquivoData = {
                file: null,
                description: null,
                repository: 'cliente/' + cliente.id,
                formId: cliente.clienteFisico ? 'form-file-fisico' : 'form-file-juridico'
            };

            FileService.addFunctionsToEscope($scope);

            $scope.listFiles();

            $scope.irParaContrato = function(){
                $state.go('layout.clienteContratoNovo', {clienteId: cliente.id});
            };

            $scope.campoBuscaProcesso = null;
            $scope.pesquisarProcesso = pesquisarProcessoFn($scope, ProcessoService);

        }]);
});