define(['../../module', 'jquery'], function (module, $) {
    'use strict';

    function setAcoesEstados($scope, estados, ComarcaService) {
        $scope.estados = estados;
        $scope.comarcas = [];
        $scope.estadoSelecionado = null;

        $scope.selecionarEstado = selecionarEstadoFn($scope, ComarcaService);
    }

    function selecionarEstadoFn($scope, ComarcaService) {
        return function () {

            ComarcaService.findAll({idEstado: $scope.filtroProcesso.estadoId, size: 1000})
                .then(function (comarcas) {
                    $scope.comarcas = comarcas._embedded.comarca;
                });
        };
    }

    function selecionarContratoSeClienteSoPossuiUm($scope) {
        if ($scope.contratos.length == 1 && !$scope.processoDto.processo.id) {
            $scope.filtroProcesso.contratoId = $scope.contratos[0].id;
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

    function setAcoesCliente($scope, ContratoService, ClienteService) {

        $scope.autoCompleteOptions = {
            minimumChars: 1,
            selectedTextAttr: 'nome',
            noMatchTemplate: '<span>Nenhum cliente encontrado com nome "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.nome}}</p>',
            data: function (searchText) {

                $scope.filtroProcesso.clienteId = null;
                $scope.filtroProcesso.contratoId = null;
                carregarContratosCliente($scope, ContratoService, null);

                return ClienteService.findAll({nome: searchText})
                    .then(function (clientesPage_) {
                        return clientesPage_.content;
                    });
            },
            itemSelected: function (e) {
                $scope.filtroProcesso.clienteId = e.item.id;
                carregarContratosCliente($scope, ContratoService, $scope.filtroProcesso.clienteId);
                iniciarPartesCliente($scope);
            }
        };

        $scope.clienteNome = null;
        $scope.desabilitarContrato = false;
    }

    function setEnumns($scope, jurixConstants) {
        $scope.tiposProcesso = jurixConstants.ENUM.EnumTipoProcesso;
        $scope.areasProcesso = jurixConstants.ENUM.EnumAreaProcesso;
        $scope.instanciasProcesso = jurixConstants.ENUM.EnumInstanciaProcesso;
        $scope.situacoesProcesso = jurixConstants.ENUM.EnumSituacaoProcesso;
    }

    function setCentrosCusto($scope, centrosCusto) {
        $scope.centrosCusto = centrosCusto;
    }

    function setColunasSelecionadasParaFiltro($scope){
        $scope.filtroProcesso.colunas = [];
        $.each( $scope.colunas, function( key, coluna ) {
            if(coluna.selecionado){
                $scope.filtroProcesso.colunas.push(coluna);
            }
        });
    }

    function gerarRelatorioFn($scope, $state) {

        $scope.$on('FILTRO_RELATORIO_SALVO', function(ev, filtroSalvo){
            $state.go('layout.relatorioProcessoResultado', {idFiltro: filtroSalvo.id});
        });

        return function (salvarRelatorio) {

            $scope.message = {};
            setColunasSelecionadasParaFiltro($scope);

            if($scope.filtroProcesso.colunas.length === 0){
                $scope.message = {error:true, errorMessage: 'Pelo menos uma coluna deve ser marcada!'};
                return;
            }

            $scope.filtroProcesso.incluirParteInteressada = $scope.colunas.incluirParteInteressada.selecionado;
            $scope.filtroProcesso.incluirParteContraria = $scope.colunas.incluirParteContraria.selecionado;

            if(salvarRelatorio){
                $scope.$root.$broadcast('NOVO_FILTRO_RELATORIO', 'RELATORIO_PROCESSO', $scope.filtroProcesso);
            }else{
                $state.go('layout.relatorioProcessoResultado', {filtroProcesso: $scope.filtroProcesso})
            }
        };
    }

    function setAcoesColunas($scope) {
        $scope.colunas = {
            cliente: {
                nome: 'Cliente',
                campo: 'contrato.cliente.nome',
                selecionado:false
            },
            contrato: {
                nome: 'Contrato',
                campo: 'contrato.descricao',
                selecionado:false
            },
            processoTipo: {
                nome: 'Tipo',
                campo: 'tipo',
                filter: 'jurixEnumFilter:EnumTipoProcesso',
                selecionado:false
            },
            processoNumero: {
                nome: 'Número do Processo',
                campo: 'numero',
                selecionado:false
            },
            processoArea: {
                nome: 'Área',
                campo: 'area',
                filter: 'jurixEnumFilter:EnumAreaProcesso',
                selecionado:false
            },
            processoTipoAcao: {
                nome: 'Tipo Ação',
                campo: 'tipoAcao.descricao',
                selecionado:false
            },
            anoDistribuicao: {
                nome: 'Data Distribuicao',
                campo: 'dataDistribuicao',
                filter: 'date:dd/MM/yyyy',
                selecionado:false
            },
            foro: {
                nome: 'Foro',
                campo: 'foro',
                selecionado:false
            },
            vara: {
                nome: 'Vara',
                campo: 'vara',
                selecionado:false
            },
            processoInstancia:{
                nome: 'Instância',
                campo: 'instancia',
                filter: 'jurixEnumFilter:EnumInstanciaProcesso',
                selecionado:false
            },
            processoValor: {
                nome: 'Valor Ação',
                campo: 'valorAcao',
                filter:'currency',
                selecionado:false
            },
            centroCustoId: {
                nome: 'Centro Custo',
                campo: 'centroCusto.descricao',
                selecionado:false
            },
            estadoId: {
                nome: 'Estado',
                campo: 'comarca.estado.nome',
                selecionado:false
            },
            comarcaId: {
                nome: 'Comarca',
                campo: 'comarca.descricao',
                selecionado:false
            },
            situacao: {
                nome: 'Status',
                campo: 'situacao',
                filter: 'jurixEnumFilter:EnumSituacaoProcesso',
                selecionado:false
            },
            ultimoAndamento:{
                nome: 'Último Andamento',
                campo: 'ultimoAndamento',
                selecionado:false
            },
            incluirParteInteressada:{
                nome: 'Parte Interessada',
                campo: 'parteInteressada',
                selecionado:false
            },
            incluirParteContraria:{
                nome: 'Parte Contrária',
                campo: 'parteContraria',
                selecionado:false
            }

        };
    }
    function setAcoesTipoAcao($scope, tiposAcao) {
        $scope.tiposAcao = tiposAcao;
    }

    module.controller('novoRelatorioProcessoControler', ['$scope', '$state', 'estados', 'centrosCusto', 'tiposAcao', 'jurixConstants', 'ComarcaService', 'ContratoService', 'ClienteService',
        function ($scope, $state, estados, centrosCusto, tiposAcao, jurixConstants, ComarcaService, ContratoService, ClienteService) {

            $scope.filtroProcesso = {
                clienteId: null,
                contratoId: null,
                processoTipo: null,
                numero: null,
                processoArea: null,
                processoTipoAcao: null,
                anoDistribuicao: null,
                foro: null,
                vara: null,
                processoInstancia:null,
                processoValor: null,
                centroCustoId: null,
                estadoId: null,
                comarcaId: null,
                situacao:null,
                colunas: []
            };
            $scope.message = {};


            setAcoesColunas($scope);
            setAcoesCliente($scope, ContratoService, ClienteService);
            setAcoesEstados($scope, estados, ComarcaService);
            setCentrosCusto($scope, centrosCusto);
            setAcoesTipoAcao($scope, tiposAcao);
            setEnumns($scope, jurixConstants);


            $scope.gerarRelatorio = gerarRelatorioFn($scope, $state);

        }]);
});

