define(['../module', 'jquery', 'angular'], function (module, $, angular) {
    'use strict';

    function setPautaEventos($scope, pautaEventosPage) {
        $scope.pautaEventosPage = pautaEventosPage;
        $scope.historicoPautaEvento = [];
        $scope.pautaEventos = pautaEventosPage.content;
    }

    function getEstadoIdPorDataLimite(pautaEvento) {
        if (pautaEvento.atrasado) {
            return 'ATRASADO';
        }
        return pautaEvento.avencer ? 'PENDENTE_FIM' : 'PENDENTE_INICIO';
    }

    function getPropriedadesPorStatus(pautaEvento, jurixConstants) {
        var estadoId = pautaEvento.situacao === 'PENDENTE' ? getEstadoIdPorDataLimite(pautaEvento) : pautaEvento.situacao;

        return jurixConstants.ENUM.PossiveisEstadosEvento.find(function (estado) {
            return estado.id === estadoId;
        });
    }

    function setPropriedadesEstado($scope, jurixConstants) {
        $scope.pautaEventos.forEach(function (pautaEvento) {
            pautaEvento.propriedadesTela = getPropriedadesPorStatus(pautaEvento, jurixConstants);
            pautaEvento.podeProrrogar = isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento) && ((pautaEvento.atrasado && pautaEvento.situacao === 'PENDENTE') || pautaEvento.situacao === 'FALHOU');
            pautaEvento.isUsuarioCriacaoIgualUsuarioLogado = isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento);
        });
    }

    function getNomeMesDoAno(jurixConstants) {
        return function (data) {
            return jurixConstants.ENUM.EnumMeses[(new Date(Date.parse(data)).getMonth()) + 1];
        };
    }

    function setPautaEventoDefault($scope) {

        $scope.pautaEvento = {
            colaborador: {}
        };

        $scope.auxiliar = {};
        $scope.numeroProcessoBusca = null;

        if (!$scope.podeCriarEventoColaboradores) {
            $scope.pautaEvento.colaborador.id = $scope.colaboradores[0].id.toString()
        }
    }

    function atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants) {
        pautaEventoService.findAllGeneral($scope.filtros)
            .then(function (pautaEventosPage) {
                setPautaEventos($scope, pautaEventosPage);
                setPropriedadesEstado($scope, jurixConstants);
            });
    }

    function exibirMsgSucesso($scope) {
        $scope.$root.$broadcast('SALVO_SUCESSO');
    }

    function salvar($scope, pautaEventoService, jurixConstants) {
        return function (isAlteracaoComFinalizacao) {

            var isValid = true;

            if (isAlteracaoComFinalizacao && $scope.auxiliar.eventoBemSucedido) {

                $scope.validarDadosFinalizacao = true;

                if (!$scope.pautaEvento.observacaoFinalizacao) {
                    isValid = false;
                    angular.element('#eventoObservacaoFinalConsultar').addClass('is-invalid');
                } else {
                    setSituacaoBaseadoEmEventoBemSucedido($scope);
                }
            }

            var form = angular.element('#formularioPautaEvento')[0];

            if (form.checkValidity() && isValid) {

                pautaEventoService.save($scope.pautaEvento).then(function () {
                    setPautaEventoDefault($scope);
                    atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
                    exibirMsgSucesso($scope);
                    fecharModal()('#eventoModal');
                });
            } else {
                exibirMsgCamposObrigatorios($scope);
            }
        }
    }

    function setColaboradores($scope, colaboradoresPage) {
        $scope.colaboradores = colaboradoresPage.content;
    }

    function buscarPautaEventoPorId($scope, pautaEventoService, idPautaEvento) {
        pautaEventoService.findById(idPautaEvento)
            .then(function (pautaEvento) {
                if (pautaEvento.situacao !== 'PENDENTE') {
                    $scope.auxiliar.eventoBemSucedido = pautaEvento.situacao == 'FINALIZADO' ? 'SIM' : 'NAO';
                } else {
                    $scope.auxiliar.eventoBemSucedido = null;
                }
                $scope.pautaEvento = pautaEvento;

                return pautaEventoService.buscarHistorico(idPautaEvento);
            })
            .then(function (historicos) {
                $scope.historicoPautaEvento = historicos;
            });
    }

    function abrirModal() {
        $('#eventoModal').modal('show');
    }

    function abrirModalEdicao($scope, pautaEventoService, idPautaEvento) {
        $scope.modoVisualizacao = false;
        $scope.modoFinalizacao = false;
        $scope.usuarioPodeAlterarFinalizado = false;
        $scope.usuarioPodeAlterarSituacao = false;
        buscarPautaEventoPorId($scope, pautaEventoService, idPautaEvento);
        abrirModal();
    }

    function abrirModalEdicaoFinalizacaoOutroUsuario($scope, pautaEventoService, idPautaEvento) {
        $scope.modoVisualizacao = true;
        $scope.modoFinalizacao = true;
        $scope.usuarioPodeAlterarFinalizado = true;
        $scope.usuarioPodeAlterarSituacao = true;
        buscarPautaEventoPorId($scope, pautaEventoService, idPautaEvento);
        abrirModal();
    }

    function abrirModalEdicaoFinalizacaoProprioUsuario($scope, pautaEventoService, idPautaEvento) {
        $scope.modoVisualizacao = true;
        $scope.modoFinalizacao = true;
        $scope.usuarioPodeAlterarFinalizado = true;
        $scope.usuarioPodeAlterarSituacao = true;
        buscarPautaEventoPorId($scope, pautaEventoService, idPautaEvento);
        abrirModal();
    }

    function abrirModalVisualizacao($scope, pautaEventoService, idPautaEvento) {
        $scope.modoVisualizacao = true;
        $scope.modoFinalizacao = false;
        $scope.usuarioPodeAlterarFinalizado = false;
        $scope.usuarioPodeAlterarSituacao = false;
        buscarPautaEventoPorId($scope, pautaEventoService, idPautaEvento);
        abrirModal();
    }

    function abrirModalFinalizar($scope, pautaEventoService, idPautaEvento) {
        $scope.modoVisualizacao = true;
        $scope.modoFinalizacao = true;
        $scope.usuarioPodeAlterarFinalizado = false;
        $scope.usuarioPodeAlterarSituacao = true;
        buscarPautaEventoPorId($scope, pautaEventoService, idPautaEvento);
        abrirModal();
    }

    function novoEvento($scope) {
        return function () {
            setPautaEventoDefault($scope);
        };
    }

    function fecharModal() {
        return function (idModal) {
            $(idModal).modal('hide');
        };
    }

    function isPautaEventoPendente(pautaEvento) {
        return pautaEvento.situacao === 'PENDENTE';
    }

    function isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento) {
        return pautaEvento.usuarioCriacao.id === $scope.$root.usuarioAtual.id
    }

    function isUsuarioCriacaoIgualResponsavel(pautaEvento) {

        return pautaEvento.usuarioCriacao.id === pautaEvento.colaborador.usuario.id
    }

    function getAcao($scope, pautaEventoService) {
        return function (pautaEvento) {

            $scope.$root.$broadcast('ON_EDITAR_PAUTA_EVENTO', pautaEvento.id);

            // angular.element('#eventoObservacaoFinalConsultar').removeClass('is-invalid');
            //
            // if (isUsuarioCriacaoIgualResponsavel(pautaEvento)) {
            //     abrirModalEdicaoFinalizacaoProprioUsuario($scope, pautaEventoService, pautaEvento.id);
            // } else if ((!isPautaEventoPendente(pautaEvento) && isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento))) {
            //     abrirModalEdicaoFinalizacaoOutroUsuario($scope, pautaEventoService, pautaEvento.id);
            // } else if (isPautaEventoPendente(pautaEvento) && isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento)) {
            //     abrirModalEdicao($scope, pautaEventoService, pautaEvento.id);
            // } else if (isPautaEventoPendente(pautaEvento) && !isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento)) {
            //     abrirModalFinalizar($scope, pautaEventoService, pautaEvento.id);
            // } else {
            //     abrirModalVisualizacao($scope, pautaEventoService, pautaEvento.id)
            // }
        };
    }

    function getLabelEventoPendente($scope) {
        return function (pautaEvento) {
            if (isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento)) {
                if (isUsuarioCriacaoIgualResponsavel(pautaEvento)) {
                    return 'Alterar/Finalizar';
                } else {
                    return 'Alterar';
                }
            } else {
                return 'Finalizar';
            }
        };
    }

    function getLabelEventoFinalizadoFn($scope) {
        return function (pautaEvento) {

            var label = pautaEvento.propriedadesTela.textoBotao;
            if (isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento)) {
                label = 'Alterar/' + label;
            }

            return label;
        }
    }

    function setSituacaoBaseadoEmEventoBemSucedido($scope) {
        $scope.pautaEvento.situacao = $scope.auxiliar.eventoBemSucedido === 'SIM' ? 'FINALIZADO' : 'FALHOU';
    }

    function exibirMsgCamposObrigatorios($scope) {
        $scope.$root.$broadcast('ERRO_CAMPOS_OBRIGATORIOS');
    }

    function finalizar($scope, pautaEventoService, jurixConstants) {
        return function () {

            $scope.validarDadosFinalizacao = true;

            angular.element('#eventoEstadoFinal').removeClass('is-invalid');
            angular.element('#eventoObservacaoFinalConsultar').removeClass('is-invalid');

            var isValid = true;
            if (!$scope.auxiliar.eventoBemSucedido) {
                angular.element('#eventoEstadoFinal').addClass('is-invalid');
                isValid = false;
            }

            if (!$scope.pautaEvento.observacaoFinalizacao) {
                angular.element('#eventoObservacaoFinalConsultar').addClass('is-invalid');
                isValid = false;
            }


            if (isValid) {

                setSituacaoBaseadoEmEventoBemSucedido($scope);
                pautaEventoService.finalizar($scope.pautaEvento).then(function () {
                    setPautaEventoDefault($scope);
                    fecharModal()('#eventoModal');
                    atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
                });

            }


        };
    }

    function apagarFn($scope, pautaEventoService, jurixConstants) {
        return function () {
            pautaEventoService.delete($scope.pautaEvento.id)
                .then(function () {
                    setPautaEventoDefault($scope);
                    atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
                });
        };
    }


    function getAutoCompleteVincularOptions($scope, ProcessoService) {
        return {
            minimumChars: 1,
            selectedTextAttr: 'numero',
            noMatchTemplate: '<span>Nenhum processo encontrado com número "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.numero}} - {{entry.item.descricao}}</p>',
            data: function (searchText) {

                $scope.pautaEvento.processo = null;

                return ProcessoService.findAll({numero: searchText, situacao: 'ATIVO'})
                    .then(function (processoPage_) {
                        return processoPage_.content;
                    });
            },
            itemSelected: function (e) {
                $scope.pautaEvento.processo = e.item;
            }
        };
    }

    function abrirFiltroFn($scope) {
        return function () {
            $scope.$root.$broadcast('ABRIR_FILTRO');
        };
    }

    function addHandlers($scope, pautaEventoService, jurixConstants) {

        $scope.$on('ON_PESQUISAR_EVENTO_PAUTA', function () {
            // setPautaEventoDefault($scope);
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        });

        $scope.$on('ON_PESQUISAR_EVENTO_PAUTA_NOVO_FILTRO', function (ev, filtros) {
            setFiltros($scope,  filtros);
            // setPautaEventoDefault($scope);
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        });


    }

    function initFiltrosPesquisa($scope, pautaEventosPage) {
        $scope.filtros = {
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
            exibirFinalizados:true,
            page: pautaEventosPage.number + 1,
            size: pautaEventosPage.size
        };
    }

    function setNextStatusOrdenacao($scope) {
        var index = $scope.statusParaOrdenacao.indexOf($scope.statusOrdenacao) + 1;

        if (index > $scope.statusParaOrdenacao.length) {
            index = 0;
        }

        $scope.statusOrdenacao = $scope.statusParaOrdenacao[index];
    }

    function ordenarEventoPorSituacaoFn($scope, pautaEventoService, jurixConstants) {
        return function () {
            setNextStatusOrdenacao($scope);
            $scope.filtros.page = 1;
            $scope.filtros.orderSituacao = $scope.statusOrdenacao;
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
        };
    }

    function ordenarEventoPorDirecaoDataFn($scope, pautaEventoService, jurixConstants) {
        return function () {
            if ($scope.filtros.direction === 'desc') {
                $scope.filtros.direction = 'asc';
            } else {
                $scope.filtros.direction = 'desc';
            }

            $scope.filtros.page = 1;

            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        };
    }

    function updatePaginationFn($scope, pautaEventoService, jurixConstants) {
        return function () {
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
        };
    }

    function prorrogarPrazoFn($scope, pautaEventoService) {
        return function (idPautaEvento) {
            pautaEventoService.findById(idPautaEvento).then(function (pautaEvento) {
                $scope.$root.$broadcast('ABRIR_PRORROGAR_PRAZO', pautaEvento);
            });
        };
    }

    function repautarEventoFn($scope, pautaEventoService) {
        return function (idPautaEvento) {
            pautaEventoService.findById(idPautaEvento).then(function (pautaEvento) {
                $scope.$root.$broadcast('REPAUTAR_EVENTO', pautaEvento);
            });
        };
    }

    function exibirDataFinalizacaoFn() {
        return function (pautaEvento) {

            if (pautaEvento.situacao !== 'FINALIZADO' && pautaEvento.situacao !== 'FALHOU') {
                return false;
            }

            return !pautaEvento.finalizadoAutomaticamente;
        };
    }

    function filtrarFinalizadosDiaFn($scope, pautaEventoService, jurixConstants) {
        return function () {

            if (!$scope.filtros.finalizadosDoDia) {
                $scope.filtros.finalizadosDoDia = true;
            } else {
                $scope.filtros.finalizadosDoDia = null;
            }

            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        }
    }

    function irParaProcessoFn($state) {
        return function (processoId) {

            fecharModal()('#eventoModal');

            setTimeout(function () {
                $state.go('layout.processoVisualizar', {id: processoId});
            }, 500);

        };
    }

    function carregarFiltroFn($scope, pautaEventoService, jurixConstants) {
        return function (filtroUsuario) {

            $scope.$root.$broadcast('REINICIAR_ORDENACAO');
            setFiltros($scope,  JSON.parse(filtroUsuario.valor));
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
        };
    }

    function ordenarEventoPorDirecaoDataFn($scope, pautaEventoService, jurixConstants) {
        return function () {
            if ($scope.filtros.direction === 'desc') {
                $scope.filtros.direction = 'asc';
            } else {
                $scope.filtros.direction = 'desc';
            }

            $scope.filtros.page = 1;

            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        };
    }

    function setFiltros($scope, filtros) {
        $scope.filtros = angular.copy(filtros);
        $scope.filtros.exibirFinalizados = true;
    }

    module.controller('pautaEventoControllerGeral', ['$scope', '$cookies', '$state', 'pautaEventosPage', 'jurixConstants', 'colaboradoresPage', 'pautaEventoService', 'ProcessoService', 'filtrosUsuario',
        function ($scope, $cookies, $state, pautaEventosPage, jurixConstants, colaboradoresPage, pautaEventoService, ProcessoService, filtrosUsuario) {

            $scope.statusParaOrdenacao = ['PENDENTE', 'FINALIZADO', 'FALHOU'];

            $scope.pagesSize = [10, 25];
            $scope.modoVisualizacaoEventos = $cookies.get('modoVisualizacaoEventosGeral') ? $cookies.get('modoVisualizacaoEventosGeral') : 'table';

            $scope.filtrosUsuario = filtrosUsuario;

            setPautaEventos($scope, pautaEventosPage);

            setPropriedadesEstado($scope, jurixConstants);

            // setColaboradores($scope, colaboradoresPage);
            //
            // setPautaEventoDefault($scope);
            //
            addHandlers($scope, pautaEventoService, jurixConstants);
            //
            initFiltrosPesquisa($scope, pautaEventosPage);
            //
            $scope.getNomeMesDoAno = getNomeMesDoAno(jurixConstants);
            //
            // $scope.salvar = salvar($scope, pautaEventoService, jurixConstants);
            //
            // $scope.finalizar = finalizar($scope, pautaEventoService, jurixConstants);
            //
            // $scope.novoEvento = novoEvento($scope);
            //
            // $scope.fecharModal = fecharModal();
            //
            $scope.getAcao = getAcao($scope, pautaEventoService);
            //
            $scope.getLabelEventoPendente = getLabelEventoPendente($scope);
            //
            $scope.getLabelEventoFinalizado = getLabelEventoFinalizadoFn($scope);
            //
            // $scope.autoCompleteProcessoOptions = getAutoCompleteVincularOptions($scope, ProcessoService);
            //
            // if (idEdit) {
            //     abrirModalEdicao($scope, pautaEventoService, idEdit);
            // }

            $scope.abrirFiltro = abrirFiltroFn($scope);

            // $scope.ordenarEventoPorSituacao = ordenarEventoPorSituacaoFn($scope, pautaEventoService, jurixConstants);
            //
            // $scope.ordenarEventoPorDirecaoData = ordenarEventoPorDirecaoDataFn($scope, pautaEventoService, jurixConstants);
            //
            // $scope.apagar = apagarFn($scope, pautaEventoService, jurixConstants);
            //
            $scope.updatePagination = updatePaginationFn($scope, pautaEventoService, jurixConstants);
            //
            // $scope.prorrogarPrazo = prorrogarPrazoFn($scope, pautaEventoService);
            //
            // $scope.repautarEvento = repautarEventoFn($scope, pautaEventoService);
            //
            $scope.exibirDataFinalizacao = exibirDataFinalizacaoFn();
            //
            // $scope.filtrarFinalizadosDia = filtrarFinalizadosDiaFn($scope, pautaEventoService, jurixConstants);
            //
            // $scope.irParaProcesso = irParaProcessoFn($state);
            //
            $scope.carregarFiltroPrincipal = carregarFiltroFn($scope, pautaEventoService, jurixConstants);

            $scope.setModoVisualizacaoEventos = function (modoVisualizacao) {
                $scope.modoVisualizacaoEventos = modoVisualizacao;
                $cookies.put('modoVisualizacaoEventosGeral', modoVisualizacao);
            };

            $scope.ordenarEventoPorDirecaoData = ordenarEventoPorDirecaoDataFn($scope, pautaEventoService, jurixConstants);

            $scope.exibirFinalizadosCheckBox = {
                pesquisar : function(){
                    atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
                }
            };

        }]);
});