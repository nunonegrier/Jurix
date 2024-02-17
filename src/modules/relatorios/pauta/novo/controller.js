define(['../../module', 'jquery'], function (module, $) {
    'use strict';


    function setColunasSelecionadasParaFiltro($scope){
        $scope.filtroPauta.colunas = [];
        $.each( $scope.colunas, function( key, coluna ) {
            if(coluna.selecionado){
                $scope.filtroPauta.colunas.push(coluna);
            }
        });
    }

    function gerarRelatorioFn($scope, $state) {

        $scope.$on('FILTRO_RELATORIO_SALVO', function(ev, filtroSalvo){
            $state.go('layout.relatorioPautaResultado', {idFiltro: filtroSalvo.id});
        });

        return function (salvarRelatorio) {

            $scope.message = {};
            setColunasSelecionadasParaFiltro($scope);

            if($scope.filtroPauta.colunas.length === 0){
                $scope.message = {error:true, errorMessage: 'Pelo menos uma coluna deve ser marcada!'};
                return;
            }

            if(salvarRelatorio){
                $scope.$root.$broadcast('NOVO_FILTRO_RELATORIO', 'RELATORIO_PAUTA', $scope.filtroPauta);
            }else{
                $state.go('layout.relatorioPautaResultado', {filtroPauta: $scope.filtroPauta})
            }
        };
    }

    function setAcoesColunas($scope) {
        $scope.colunas = {
            tipo: {
                nome: 'Tipo',
                campo: 'tipo',
                selecionado:false
            },
            idResponsavel: {
                nome: 'Responsável',
                campo: 'colaborador.usuario.nome',
                selecionado:false
            },
            idProcesso: {
                nome: 'Nº Processo',
                campo: 'processo.numero',
                selecionado:false
            },
            dataPublicacao: {
                nome: 'Publicação',
                campo: 'dataPublicacao',
                selecionado:false,
                filter: 'date:dd/MM/yyyy'
            },
            dataLimite: {
                nome: 'Data Limite',
                campo: 'dataLimite',
                selecionado:false,
                filter: 'date:dd/MM/yyyy'
            },
            descricao: {
                nome: 'Descrição',
                campo: 'descricao',
                selecionado:false
            },
            observacao: {
                nome: 'Observações',
                campo: 'observacaoCriacao',
                selecionado:false
            }
        };
    }

    function setDateOptions($scope) {

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
    }

    function getAutoCompleteVincularOptions($scope, ProcessoService) {
        return {
            minimumChars: 1,
            selectedTextAttr: 'numero',
            noMatchTemplate: '<span>Nenhum processo encontrado com número "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.numero}} - {{entry.item.descricao}}</p>',
            data: function (searchText) {

                $scope.filtroPauta.idProcesso = null;

                return ProcessoService.findAll({numero: searchText, situacao: 'ATIVO'})
                    .then(function (processoPage_) {
                        return processoPage_.content;
                    });
            },
            itemSelected: function (e) {
                $scope.filtroPauta.idProcesso = e.item.id;
            }
        };
    }

    module.controller('novoRelatorioPautaControler', ['$scope', '$state', 'colaboradoresPage', 'ProcessoService',
        function ($scope, $state, colaboradoresPage, ProcessoService) {

            $scope.filtroPauta = {
                tipo: null,
                idResponsavel: null,
                idProcesso: null,
                tipoData: 'DATA_PUBLICACAO',
                intervaloData: 'FIXO',
                dataInicio: null,
                dataFim: null,
                dataLimiteInit: null,
                dataLimiteFim: null,
                descricaoPauta: null,
                observacaoPauta: null

            };
            $scope.numeroProcessoBusca = null;
            $scope.message = {};

            setAcoesColunas($scope);
            setDateOptions($scope);

            $scope.colaboradores = colaboradoresPage.content;
            $scope.autoCompleteProcessoOptions = getAutoCompleteVincularOptions($scope, ProcessoService);

            $scope.gerarRelatorio = gerarRelatorioFn($scope, $state);

        }]);
});

