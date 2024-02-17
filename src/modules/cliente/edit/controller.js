/**
 * @author hebert ramos
 */
define(['../module', 'angular'], function (module, angular) {
    'use strict';

    function setNomeMenu($scope) {
        if ($scope.cliente.id) {
            $scope.$root.nomeMenuCliente = 'EDITAR';
        } else {
            $scope.$root.nomeMenuCliente = 'CADASTRAR';
        }
    }
	
	function removerGrupoSeNaoExistir($scope){
		if($scope.cliente.grupo && !$scope.cliente.grupo.id){
			delete $scope.cliente.grupo;
		}
	}

    function salvarFisicoFn($scope, $q, $state, ClienteService, FileService) {
        return function () {

            var form = angular.element('#formFisico')[0];

            if (form.checkValidity()) {

                $scope.desabilitaSalvar = true;
                $scope.cliente.clienteJuridico = null;
				removerGrupoSeNaoExistir($scope);
				
                ClienteService.salvarFisico($scope.cliente)
                    .then(posSalvarCliente($scope, $q, $state, 'layout.clienteFisicoEditar', FileService))
                    .catch(function (err) {
                        $scope.desabilitaSalvar = false;
                    });
            } else {
                exibirMsgCamposObrigatorios($scope);
            }

            form.classList.add('was-validated');
        };
    }

    function exibirMsgCamposObrigatorios($scope) {
        $scope.$root.$broadcast('ERRO_CAMPOS_OBRIGATORIOS');
    }

    function salvarJuridicoFn($scope, $q, $state, ClienteService, FileService) {
        return function () {

            var form = angular.element('#formJuridico')[0];

            if (form.checkValidity()) {

                $scope.desabilitaSalvar = true;
                $scope.cliente.clienteFisico = null;
				removerGrupoSeNaoExistir($scope);

                ClienteService.salvarJuridico($scope.cliente)
                    .then(posSalvarCliente($scope, $q, $state, 'layout.clienteJuridicoEditar', FileService))
                    .catch(function () {
                        $scope.desabilitaSalvar = false;
                    });
            } else {
                exibirMsgCamposObrigatorios($scope);
            }

            form.classList.add('was-validated');
        };
    }

    function atualizarArquivosTemporarios($scope, clienteSalvo) {
        setClienteRespository($scope, clienteSalvo);
        $scope.$root.$broadcast('SALVAR_ARQUIVOS_TEMPORARIOS', $scope.filesRespository);

    }

    function posSalvarCliente($scope, $q, $state, stateName, FileService) {

        $scope.desabilitaSalvar = false;

        return function (clienteSalvo) {

            atualizarArquivosTemporarios($scope, clienteSalvo);

            $state.go(stateName, {id: clienteSalvo.id, isFromNovo: true});
        };
    }

    function exibirMensagemSucesso($scope) {
        $scope.message = {success: true};
    }

    function selecionarEstadoFn($scope, LocalidadeService) {
        return function () {

            LocalidadeService.buscarMunicipios($scope.estadoSelecionado)
                .then(function (municipios) {
                    $scope.municipios = municipios;
                });
        };
    }

    function iniciarEstado($scope) {

        if ($scope.cliente.id) {
            $scope.estadoSelecionado = $scope.cliente.municipio.estado.id;
            $scope.selecionarEstado();
        } else {
            $scope.estadoSelecionado = null;
            $scope.municipios = [];
        }
    }

    function setDateOptions($scope) {

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
    }

    function setClienteRespository($scope, cliente) {
        $scope.filesRespository = cliente.id ? 'cliente/' + cliente.id : 'cliente/novo';
    }


    function isEstadoCivilCasado(clienteFisico) {
        return clienteFisico && clienteFisico.estadoCivil && clienteFisico.estadoCivil !== 'CASADO'
    }

    function selecionarEstadoCivilFn($scope) {

        return function (isIniti) {

            if (isEstadoCivilCasado($scope.cliente.clienteFisico)) {
                $scope.cliente.clienteFisico.tipoEstadoCivil = 'NAO_APLICAVEL';
                $scope.tipoEstadoCivilDisabled = true;
            } else {

                if (!isIniti) {
                    $scope.cliente.clienteFisico.tipoEstadoCivil = null;
                }

                $scope.tipoEstadoCivilDisabled = false;

            }
        };
    }

    function excluirFn($scope, $state, ClienteService) {

        //TODO exibir modal de confirmação.

        return function () {

            ClienteService.delete($scope.cliente.id)
                .then(function () {
                    $state.go('layout.clienteList');
                });
        }

    }

    function adicionarGrupoFn($scope){

        return function(){
            $scope.$root.$broadcast('ADICIONAR_GRUPO_CLIENTE');
        };
    }

    function addHandlers($scope, GrupoClienteService){

        $scope.$on('GRUPO_CLIENTE_SALVO', function(ev, grupoCliente){

            GrupoClienteService.buscarGrupos()
                .then(function(grupos){
                    $scope.grupos = grupos;
                    $scope.cliente.grupo = grupoCliente;
                });
        });
    }

    module.controller('FormClienteController', ['$scope', '$state', '$q', 'isFromNovo', 'jurixConstants', 'cliente', 'estados', 'grupos', 'ClienteService', 'LocalidadeService', 'FileService', 'GrupoClienteService',
        function ($scope, $state, $q, isFromNovo, jurixConstants, cliente, estados, grupos, ClienteService, LocalidadeService, FileService, GrupoClienteService) {

            $scope.cliente = cliente;
            $scope.estados = estados;
            $scope.grupos = grupos;

            $scope.tiposFundacao = jurixConstants.ENUM.EnumTipoFundacao;
            $scope.estadosCivil = jurixConstants.ENUM.EnumEstadoCivil;
            $scope.tiposEstadoCivil = jurixConstants.ENUM.EnumTipoEstadoCivil;


            $scope.desabilitaSalvar = false;

            setNomeMenu($scope);
            setDateOptions($scope);

            $scope.salvarFisico = salvarFisicoFn($scope, $q, $state, ClienteService, FileService);
            $scope.salvarJuridico = salvarJuridicoFn($scope, $q, $state, ClienteService, FileService);
            $scope.selecionarEstado = selecionarEstadoFn($scope, LocalidadeService);
            $scope.selecionarEstadoCivil = selecionarEstadoCivilFn($scope);
            $scope.excluir = excluirFn($scope, $state, ClienteService);
            $scope.adicionarGrupo = adicionarGrupoFn($scope);

            setClienteRespository($scope, cliente);
            iniciarEstado($scope);

            $scope.selecionarEstadoCivil(true);

            if (isFromNovo) {
                exibirMensagemSucesso($scope);
            }

            addHandlers($scope, GrupoClienteService);

            $scope.setCurrentTab = function(tabName){
                $scope.currentTab = tabName;
            };

            $scope.currentTab = (!cliente.clienteJuridico || !cliente.clienteJuridico.id ? 'fisica' : 'juridica');

            $scope.isTabVisible = function(tabName){
                return $scope.currentTab == tabName;
            };

        }]);
});