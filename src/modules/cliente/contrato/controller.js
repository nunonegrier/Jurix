/**
 * @author hebert ramos
 */
define(['../module', 'angular'], function (module, angular) {
    'use strict';


    function setDateOptions($scope) {

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
    }

    function exibirMsgCamposObrigatorios($scope){
        $scope.$root.$broadcast('ERRO_CAMPOS_OBRIGATORIOS');
    }

    function salvarContratoFn($scope, $q, $state, ContratoService) {
        return function () {

            var form = angular.element('#formContrato')[0];

            if (form.checkValidity()) {

                if(!$scope.contrato.informarDataVencimento){
                    $scope.contrato.dataVencimento = $scope.contrato.dataInicio;
                }

                ContratoService.save($scope.contrato)
                    .then(function (contratoSalvo) {

                        $scope.contrato = contratoSalvo;

                        atualizarArquivosTemporarios($scope, contratoSalvo);

                        $state.go('layout.clienteContratoEditar', {clienteId: $scope.contrato.cliente.id, id: $scope.contrato.id, isFromSalvar: true});
                    });
            }else{
                exibirMsgCamposObrigatorios($scope);
            }

            form.classList.add('was-validated');
        };
    }

    function exibirMsgCamposObrigatorios($scope){
        $scope.$root.$broadcast('ERRO_CAMPOS_OBRIGATORIOS');
    }

    function exibirMensagemSucesso($scope){
        $scope.message = {success: true};
    }

    function excluirFn($scope, $state, ContratoService){

        //TODO exibir modal de confirmação.

        return function() {
            ContratoService.delete($scope.cliente.id, $scope.contrato.id)
                .then(function () {

                    angular.element('#apagarContratoModal').modal('hide');

                    if($scope.cliente.clienteFisico){
                        $state.go('layout.clienteFisicoVisualizar', {cliente: $scope.cliente.id, id: $scope.contrato.id});
                    }else{
                        $state.go('layout.clienteJuridicoVisualizar', {cliente: $scope.cliente.id, id: $scope.contrato.id});
                    }

                });
        };

    }

    function iniciarEncerrarFn($scope, contasReceberService){
        return function(){
            $scope.opcaoEncerrar = "NAO";
            $scope.possuiContaAtiva = false;

            contasReceberService.buscarContaAtivaContrato($scope.contrato.id)
                .then(function(contaReceberAtiva){

                    $scope.possuiContaAtiva = !!contaReceberAtiva.id;
                    angular.element('#encerrarContratoModal').modal('show');
                });
        };
    }

    function encerrarFn($scope, $state, ContratoService){

        return function() {
            ContratoService.encerrar($scope.cliente.id, $scope.contrato.id, $scope.opcaoEncerrar === 'SIM')
                .then(function () {

                    angular.element('#encerrarContratoModal').modal('hide');

                    $state.go('layout.clienteContratoEditar', {clienteId: $scope.contrato.cliente.id, id: $scope.contrato.id, isFromSalvar: true});
                });
        };
    }

    function atualizarArquivosTemporarios($scope,contratoSalvo) {
        setRepositoryContrato($scope, contratoSalvo);
        $scope.$root.$broadcast('SALVAR_ARQUIVOS_TEMPORARIOS', $scope.filesRespository);

    }

    //TODO remover duplicidade
    function setRepositoryContrato($scope, contrato) {
        $scope.filesRespository = contrato.id ? 'contrato/' + contrato.id : 'contrato/novo';
    }

    module.controller('ContratoController', ['$scope', '$state', '$q', 'arquivos', 'jurixConstants', 'cliente', 'contrato', 'centrosCusto', 'visualizar', 'ContratoService', 'isFromSalvar', 'contasReceberService',
        function ($scope, $state, $q, arquivos, jurixConstants, cliente, contrato, centrosCusto, visualizar, ContratoService, isFromSalvar, contasReceberService) {

            $scope.cliente = cliente;
            $scope.contrato = contrato;
            $scope.centrosCusto = centrosCusto;

            $scope.contrato.clienteId = cliente.id;

            $scope.tiposContrato = jurixConstants.ENUM.EnumTipoContrato;
            $scope.indexadores = jurixConstants.ENUM.EnumIndexadorContrato;

            setDateOptions($scope);

            $scope.salvarContrato = salvarContratoFn($scope, $q, $state, ContratoService);
            $scope.excluir = excluirFn($scope, $state, ContratoService);

            $scope.iniciarEncerrar = iniciarEncerrarFn($scope, contasReceberService);
            $scope.encerrar = encerrarFn($scope, $state, ContratoService);

            $scope.visualizacao = visualizar;

            if(isFromSalvar){
                exibirMensagemSucesso($scope);
            }

            setRepositoryContrato($scope, contrato);

        }]);
});