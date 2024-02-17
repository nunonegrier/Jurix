define(['../module'], function (module) {
    'use strict';

    function setColaborador($scope, colaborador) {
        $scope.colaborador = colaborador;
    }

    function setAcao($scope, acao) {
        $scope.acao = acao;
    }

    function setPerfis($scope, perfis) {
        $scope.perfis = perfis;
    }

    function validarSenhasIguais($scope) {
        if ($scope.colaborador.usuario.senha !== $scope.confirmacaoSenha) {
            throw new SyntaxError('Senha incorreta');
        }
    }

    function sucesso($state, $scope, id_) {
        $state.go('layout.colaboradorEditar', {id: id_, isFromNovo: true});
    }

    function exibirMensagemSucesso($scope) {
        $scope.message = {success: true};
    }

    function salvarColaborador($scope, $state, colaboradorService) {
        colaboradorService.save($scope.colaborador).then(function (colaboradorSalvo) {
            sucesso($state, $scope, colaboradorSalvo.id);
        });
    }

    function salvar($scope, $state, colaboradorService) {
        return function () {
            var form = angular.element('#formularioColaborador')[0];

            if (form.checkValidity()) {

                validarSenhasIguais($scope);

                salvarColaborador($scope, $state, colaboradorService);
            }else{
                exibirMsgCamposObrigatorios($scope);
            }

            form.classList.add('was-validated');
        };
    }

    function exibirMsgCamposObrigatorios($scope){
        $scope.$root.$broadcast('ERRO_CAMPOS_OBRIGATORIOS');
    }

    function setDateOptions($scope) {
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
    }

    function setLabels($scope, jurixConstants) {
        $scope.label = jurixConstants.ENUM.EstadosTela.find(function (element) {
            return element.id === $scope.acao;
        });
    }

    function redirecionarEdicao($scope, $state) {
        return function () {
            $state.go('layout.colaboradorEditar', {id: $scope.colaborador.id});
        }
    }

    function validarPodeVisualizarOutrosUSuarios($scope, $state, SegurancaService){

        var isColaboradorDoUsuarioAtual = $scope.colaborador.usuario.id == $scope.$root.usuarioAtual.id;

        if(!isColaboradorDoUsuarioAtual && !SegurancaService.possuiPermissao('Colaborador.Editar')){
            $state.go('layout.home');
        }
    }

    module.controller('editColaboradorController', ['$scope', '$state', 'colaborador', 'acao', 'colaboradorService', 'perfis', 'jurixConstants', 'isFromNovo', 'SegurancaService',
        function ($scope, $state, colaborador, acao, colaboradorService, perfis, jurixConstants, isFromNovo, SegurancaService) {

        setAcao($scope, acao);

        setLabels($scope, jurixConstants);

        setColaborador($scope, colaborador);

        setPerfis($scope, perfis);

        setDateOptions($scope);

        validarPodeVisualizarOutrosUSuarios($scope, $state, SegurancaService);

        $scope.salvar = salvar($scope, $state, colaboradorService);

        $scope.redirecionarEdicao = redirecionarEdicao($scope, $state);

        if (isFromNovo) {
            exibirMensagemSucesso($scope);
        }

        $scope.podeAlterarSenha =  colaborador.usuario.id == $scope.$root.usuarioAtual.id;
        $scope.alterarSenha = function(){
            $scope.$root.$broadcast('ALTERAR_SENHA');
        };

        $scope.desativar = function(){
            $scope.colaborador.usuario.situacao = 'INATIVO';
        };

        $scope.ativar = function(){
            $scope.colaborador.usuario.situacao = 'ATIVO';
        };
    }]);
});

