define(['../module', 'text!./modal.html', '../pautaEventoController'], function (module, view, pautaEventoController) {
    'use strict';
    module.directive('modaFiltroPauta', [function () {

        var idModal = '#filtrosAvancados';

        function setAutoCompleteClienteOptions($scope, ClienteService) {

            $scope.autoCompleteClienteFilterOptions = {
                minimumChars: 1,
                selectedTextAttr: 'nome',
                noMatchTemplate: '<span>Nenhum cliente com pauta encontrado com nome "{{entry.searchText}}"</span>',
                itemTemplate: '<p>{{entry.item.nome}}</p>',
                data: function (searchText) {

                    $scope.filtrosModel.idCliente = null;

                    return ClienteService.findAll({nome: searchText, clienteComProcessPossuiPauta: true})
                        .then(function (clientesPage_) {
                            return clientesPage_.content;
                        });
                },
                itemSelected: function (e) {
                    $scope.filtrosModel.idCliente = e.item.id;
                }
            };

            $scope.clienteNomeFilter = null;
        }

        function setAutoCompleteProcessoOptions($scope, ProcessoService) {
            $scope.autoCompleteProcessoFilterOptions =  {
                minimumChars: 1,
                selectedTextAttr: 'numero',
                noMatchTemplate: '<span>Nenhum processo encontrado com número "{{entry.searchText}}"</span>',
                itemTemplate: '<p>{{entry.item.numero}} - {{entry.item.descricao}}</p>',
                data: function (searchText) {

                    $scope.filtrosModel.idProcesso = null;

                    return ProcessoService.findAll({numero: searchText, possuiPauta: true})
                        .then(function (processoPage_) {
                            return processoPage_.content;
                        });
                },
                itemSelected: function (e) {
                    $scope.filtrosModel.idProcesso = e.item.id;
                }
            };
            $scope.numeroProcessoFilter = null;
        }

        function filtrarEPesquisar($scope) {

            $scope.$root.$broadcast('ON_PESQUISAR_EVENTO_PAUTA_NOVO_FILTRO', $scope.filtrosModel);
            $(idModal).modal('hide');
        }


        return {
            restrict: 'E',
            template: view,
            controller: ['$scope', 'colaboradorService', 'ClienteService', 'ParteProcessoService', 'ProcessoService', 'FiltroService',
                function ($scope, colaboradorService, ClienteService, ParteProcessoService, ProcessoService, FiltroService) {

                    $scope.colaboradoresCompauta = [];
                    $scope.isDadosCarregados = false;


                    $scope.initDadosFiltro = function () {
                        $scope.criarFiltros = false;
                        $scope.nomeFiltro = null;
                        $scope.filtroPadrao = false;
                        $scope.numeroProcessoFilter = null;
                        $scope.clienteNomeFilter = null;
                        $scope.filtroCarregado = null;
                        $scope.filtrosModel = {
                            idResponsavel: null,
                            idCliente: null,
                            idParte: null,
                            idProcesso: null,
                            dataInicio: null,
                            dataFim: null,
                            intervaloData: null,
                            tipoData: null,
                            tipo: null,
                            dataPublicacao: null,
                            situacao: null,
                            observacaoPauta:null,
                            descricaoPauta:null,
                            sort: 'dataLimite',
                            direction: 'desc',
                            page: 1,
                            size: 10
                        };
                    };


                    $scope.intervalosData = [
                        {id: 'HOJE', nome: 'Hoje'},
                        {id: 'ULTIMA_SEMANA', nome: 'Ultima Semana'},
                        {id: 'ESTE_MES', nome: 'Este Mês'},
                        {id: 'FIXO', nome: 'Escolher Datas'},
                    ];
                    $scope.listaStatusPauta = [
                        {id: 'PENDENTE', nome: 'Pendentes'},
                        {id: 'FINALIZADO', nome: 'Finalizados'},
                        {id: 'ATRASADO', nome: 'Atrasados'},
                        {id: 'FALHOU', nome: 'Falhados'}
                    ];

                    $scope.tiposPauta = [
                        {id: 'TAREFA', nome: 'Tarefas'},
                        {id: 'PRAZO', nome: 'Prazos'}
                    ];

                    setAutoCompleteProcessoOptions($scope, ProcessoService);

                    setAutoCompleteClienteOptions($scope, ClienteService);

                    $scope.$on('ABRIR_FILTRO', function () {


                        $scope.initDadosFiltro();

                        if ($scope.isDadosCarregados) {

                            $(idModal).modal('show');
                            return;
                        }

                        colaboradorService.findAll({"responsavelPauta": true})
                            .then(function (colaboradorPage) {

                                $scope.colaboradoresCompauta = colaboradorPage.content;

                                return ParteProcessoService.findAll({
                                    parteEmProcessoComPauta: true,
                                    tipoParte: 'CONTRARIA'
                                });
                            })
                            .then(function (parteProcessoPage) {

                                $scope.partesProcesso = parteProcessoPage.content;
                                $scope.isDadosCarregados = true;

                                $(idModal).modal('show');
                            });

                    });

                    $scope.pesquisar = function () {

                        if ($scope.criarFiltros) {

                            var novoFiltro = {};
                            if ($scope.filtroCarregado) {
                                novoFiltro = $scope.filtroCarregado;
                            }

                            novoFiltro.padrao = $scope.filtroPadrao;
                            novoFiltro.nome = $scope.nomeFiltro;
                            novoFiltro.valor = JSON.stringify($scope.filtrosModel);
                            novoFiltro.tipo = 'PAUTA_EVENTO';


                            FiltroService.save(novoFiltro)
                                .then(function () {
                                    return FiltroService.findAllArray({tipoFiltro: 'PAUTA_EVENTO'});
                                })
                                .then(function (resp) {
                                    $scope.$parent.filtrosUsuario = resp;
                                    $scope.filtrosUsuario = resp;
                                    filtrarEPesquisar($scope);
                                })
                        } else {
                            filtrarEPesquisar($scope);
                        }
                    };

                    $scope.carregarFiltrosUsuario = function (filtroUsuario) {

                        $scope.filtroCarregado = filtroUsuario;
                        $scope.criarFiltros = true;
                        $scope.nomeFiltro = filtroUsuario.nome;
                        $scope.filtroPadrao = filtroUsuario.padrao;
                        $scope.filtrosModel = JSON.parse(filtroUsuario.valor);


                        if($scope.filtrosModel.idCliente){
                            ClienteService.findById($scope.filtrosModel.idCliente)
                                .then(function(cliente){
                                    $scope.clienteNomeFilter = cliente.nome;
                                });
                        }

                        if($scope.filtrosModel.idProcesso){
                            ProcessoService.findById($scope.filtrosModel.idProcesso)
                                .then(function(processoDto){
                                    $scope.numeroProcessoFilter = processoDto.processo.numero;
                                });
                        }

                    };

                    $scope.abrirModalRemoverFiltro = function (filtroUsuario) {
                        $scope.filtroUsuarioPararemover = filtroUsuario;
                        $('#apagarFiltroPauta').modal('show');
                    };

                    $scope.removerFiltro = function () {

                        FiltroService.delete($scope.filtroUsuarioPararemover.id)
                            .then(function () {
                                return FiltroService.findAllArray({tipoFiltro: 'PAUTA_EVENTO'});
                            })
                            .then(function (resp) {
                                $scope.$parent.filtrosUsuario = resp;
                                $scope.filtrosUsuario = resp;
                            });

                    };

                }]
        };
    }]);
});