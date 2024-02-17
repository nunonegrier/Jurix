define(['../module', 'lodash'], function (module, _) {
    'use strict';

    function setNomeMenu($scope) {
        if ($scope.processoDto.processo.id) {
            $scope.$root.nomeMenuCliente = 'EDITAR';
            $scope.$root.iconeMenuCliente = 'fa-pencil-alt';
        } else {
            $scope.$root.nomeMenuCliente = 'CADASTRAR';
            $scope.$root.iconeMenuCliente = 'fa-plus';
        }
    }

    function setProcesso($scope, ClienteService, ContratoService, processoDto) {
        $scope.processoDto = processoDto;
    }

    function setAcao($scope, acao) {
        $scope.acao = acao;
    }

    function setDateOptions($scope) {
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
    }

    function selecionarContratoSeClienteSoPossuiUm($scope){
        if($scope.contratos.length == 1 && !$scope.processoDto.processo.id){
            $scope.processoDto.processo.contrato = $scope.contratos[0];
            $scope.desabilitarContrato = true;
        }
    }

    function carregarContratosCliente($scope, ContratoService, clienteId) {
        if (clienteId) {
            ContratoService.findAll({clienteId: clienteId})
                .then(function (contratos) {
                    $scope.contratos = contratos;
                    selecionarContratoSeClienteSoPossuiUm($scope);
                });
        } else {
            $scope.contratos = [];
        }
    }


    function setEnumns($scope, jurixConstants) {
        $scope.tiposProcesso = jurixConstants.ENUM.EnumTipoProcesso;
        $scope.areasProcesso = jurixConstants.ENUM.EnumAreaProcesso;
        $scope.instanciasProcesso = jurixConstants.ENUM.EnumInstanciaProcesso;
    }

    function setAcoesCliente($scope, ContratoService, ClienteService, cliente, contrato) {

        $scope.autoCompleteOptions = {
            minimumChars: 1,
            selectedTextAttr: 'nome',
            noMatchTemplate: '<span>Nenhum cliente encontrado com nome "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.nome}}</p>',
            data: function (searchText) {

                $scope.processoDto.processo.contrato.cliente = null;
                carregarContratosCliente($scope, ContratoService, null);

                return ClienteService.findAll({nome: searchText})
                    .then(function (clientesPage_) {
                        return clientesPage_.content;
                    });
            },
            itemSelected: function (e) {
                $scope.processoDto.processo.contrato.cliente = e.item;
                carregarContratosCliente($scope, ContratoService, $scope.processoDto.processo.contrato.cliente.id);
                iniciarPartesCliente($scope);
            }
        };

        $scope.clienteNome = null;
        $scope.desabilitarCliente = false;
        $scope.desabilitarContrato = false;

        if(!$scope.processoDto.processo.id){

            if(contrato){

                $scope.processoDto.processo.contrato = contrato;
                $scope.clienteNome = contrato.cliente.nome;
                $scope.desabilitarCliente = true;
                $scope.desabilitarContrato = true;

                $scope.contratos = [$scope.processoDto.processo.contrato];

            }else if(cliente) {

                $scope.processoDto.processo.contrato.cliente = cliente;
                $scope.clienteNome = cliente.nome;
                $scope.desabilitarCliente = true;

                carregarContratosCliente($scope, ContratoService, cliente.id);
            }

        } else {

            $scope.clienteNome = $scope.processoDto.processo.contrato.cliente.nome;
            $scope.desabilitarCliente = true;
            $scope.desabilitarContrato = true;

            $scope.contratos = [$scope.processoDto.processo.contrato];
        }
    }

    function setAcoesTipoAcao($scope, tiposAcao) {
        $scope.tiposAcao = tiposAcao;

        $scope.$on('AFTER_ADD_TIPO_ACAO', function (ev, tipoAcaoSalvo) {
            $scope.tiposAcao.push(tipoAcaoSalvo);
            $scope.processoDto.processo.tipoAcao.id = tipoAcaoSalvo.id;
        });
    }

    function setCentrosCusto($scope, centrosCusto) {
        $scope.centrosCusto = centrosCusto;
    }

    function setAcoesEstados($scope, estados) {
        $scope.estados = estados;
        $scope.comarcas = [];

        if ($scope.processoDto.processo.id) {
            $scope.estadoSelecionado = $scope.processoDto.processo.comarca.estado.id;
            $scope.selecionarEstado();
        } else {
            $scope.estadoSelecionado = null;
        }
    }

    function selecionarEstadoFn($scope, ComarcaService) {
        return function () {

            ComarcaService.findAll({idEstado: $scope.estadoSelecionado, size: 1000})
                .then(function (comarcas) {
                    $scope.comarcas = comarcas._embedded.comarca;
                });
        };
    }

    function iniciarPartesCliente($scope) {
        var parteCliente = {
            nome: $scope.processoDto.processo.contrato.cliente.nome,
            contato: $scope.processoDto.processo.contrato.cliente.telefone,
            cliente: $scope.processoDto.processo.contrato.cliente,
            posicaoParte:{id: -1}
        };

        $scope.processoDto.partesCliente = [];
        $scope.processoDto.partesCliente.push(parteCliente);
        $scope.processoDto.partesContratia = [{nome: null, contato: null, desabilitado: false}];
    }

    function salvarProcessoFn($scope, $state, ProcessoService) {
        return function () {

            var form = angular.element('#formProcesso')[0];

            if (form.checkValidity()) {

                if($scope.processoDto.processo.processoVinculado && $scope.processoDto.processo.processoVinculado.numero == $scope.processoDto.processo.numero){
                    alert('Não é possível vincular o processo a ele mesmo.');
                    return;
                }

                ProcessoService.save($scope.processoDto)
                    .then(function (processoDtoSalvo) {
                        $state.go('layout.processoEditar', {id: processoDtoSalvo.processo.id, isFromNovo: true});
                        exibirMensagemSucesso($scope);
                    })
                    .catch(function (resp) {
                         var msg = 'Não foi possível salvar o processo.'
                         if(resp.data && resp.data.message){
                                $scope.message.error = true;
                                $scope.message.errorMessage = resp.data.message
                         }

                         $scope.message.error = true;
                         $scope.message.errorMessage = resp.data.message
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

    function addTipoAcaoFn($scope) {
        return function () {
            $scope.$root.$broadcast('ADD_TIPO_ACAO');
        };
    }

    function setPartesProcesso($scope) {

        if(!$scope.processoDto.processo.id) {

            if($scope.processoDto.processo.contrato.cliente.id){
                iniciarPartesCliente($scope);
            }
        }

        if(!$scope.processoDto.partesRemover){
            $scope.processoDto.partesRemover = [];
        }
    }

    function exibirMensagemSucesso($scope) {
        $scope.message = {success: true};
    }

    function vincularProcessoFn($scope){
        return function(){
            $scope.$root.$broadcast('INIT_VINCULAR_PROCESSO', $scope.processoDto.processo);
        };
    }

    function initHandlerVincularProcesso($scope){
        $scope.$on('VINCULAR_PROCESSO', function(ev, processoVinculo){
            $scope.processoDto.processo.processoVinculado = processoVinculo;
        });
    }


    module.controller('editProcessoController', ['$scope', '$state', 'jurixConstants', 'ProcessoService', 'ClienteService', 'ContratoService', 'ComarcaService', 'processoDto', 'acao', 'tiposAcao', 'centrosCusto', 'estados', 'cliente', 'contrato', 'isFromNovo',
        function ($scope, $state, jurixConstants, ProcessoService, ClienteService, ContratoService, ComarcaService, processoDto, acao, tiposAcao, centrosCusto, estados, cliente, contrato, isFromNovo) {

            setAcao($scope, acao);
            setDateOptions($scope);
            setProcesso($scope, ClienteService, ContratoService, processoDto);
            setEnumns($scope, jurixConstants);
            setAcoesTipoAcao($scope, tiposAcao);
            setCentrosCusto($scope, centrosCusto);
            setAcoesCliente($scope, ContratoService, ClienteService, cliente, contrato);
            setPartesProcesso($scope);
            setNomeMenu($scope);
            initHandlerVincularProcesso($scope);

            $scope.selecionarEstado = selecionarEstadoFn($scope, ComarcaService);
            $scope.salvarProcesso = salvarProcessoFn($scope, $state, ProcessoService);
            $scope.addTipoAcao = addTipoAcaoFn($scope);
            $scope.vincularProcesso = vincularProcessoFn($scope);

            setAcoesEstados($scope, estados);

            if (isFromNovo) {
                exibirMensagemSucesso($scope);
            }
        }]);
});

