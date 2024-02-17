define(['./module', 'jquery', 'angular'], function (module, $, angular) {
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
        pautaEventoService.ultimoFiltro = $scope.filtros;
        pautaEventoService.findAll($scope.filtros)
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
                } else if (!isObservacaoFinalizacaoValida($scope)) {
                    isValid = false;
                } else {
                    setSituacaoBaseadoEmEventoBemSucedido($scope);
                }

            }

            var form = angular.element('#formularioPautaEvento')[0];

            angular.element('#formularioPautaEvento').find('.is-invalid').removeClass('is-invalid');

            if (form.checkValidity() && isValid) {

                pautaEventoService.save($scope.pautaEvento).then(function (pautaEventoSalvo) {
                    atualizarArquivosTemporarios($scope, pautaEventoSalvo);
                    setPautaEventoDefault($scope);
                    atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
                    exibirMsgSucesso($scope);
                    fecharModal()('#eventoModal');
                });
            } else {
                exibirMsgCamposObrigatorios($scope);
                angular.element('#formularioPautaEvento').find('.ng-invalid').addClass('is-invalid');
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
            $scope.novoEventoOpened = true;
            $scope.modalAcao = false;
            setPautaEventoDefault($scope);
            $scope.filesRespository = 'pautaEvento/novo';
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

            angular.element('#eventoObservacaoFinalConsultar').removeClass('is-invalid');

            if (isUsuarioCriacaoIgualResponsavel(pautaEvento)) {
                abrirModalEdicaoFinalizacaoProprioUsuario($scope, pautaEventoService, pautaEvento.id);
            } else if ((!isPautaEventoPendente(pautaEvento) && isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento))) {
                abrirModalEdicaoFinalizacaoOutroUsuario($scope, pautaEventoService, pautaEvento.id);
            } else if (isPautaEventoPendente(pautaEvento) && isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento)) {
                abrirModalEdicao($scope, pautaEventoService, pautaEvento.id);
            } else if (isPautaEventoPendente(pautaEvento) && !isUsuarioCriacaoIgualUsuarioLogado($scope, pautaEvento)) {
                abrirModalFinalizar($scope, pautaEventoService, pautaEvento.id);
            } else {
                abrirModalVisualizacao($scope, pautaEventoService, pautaEvento.id)
            }

            setEventoPautaRespository($scope, pautaEvento);

            if($scope.novoEventoOpened){
                angular.element('#collapse-1').collapse('hide');
            }
            $scope.novoEventoOpened = false;
            $scope.modalAcao = true;
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
            }else{
                isValid = isObservacaoFinalizacaoValida($scope);
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

    function isObservacaoFinalizacaoValida($scope) {
        if ($scope.minimoObservacao > 0 && $scope.minimoObservacao > $scope.pautaEvento.observacaoFinalizacao.trim().length) {
            angular.element('#eventoObservacaoFinalConsultar').addClass('is-invalid');
            return false;

        }
        return true;
    }

    function iniciarApagarFn(){
        return function(){
           angular.element('#apagarEventoModal').modal('show');
        };
    }

    function apagarFn($scope, pautaEventoService, jurixConstants) {
        return function () {
            pautaEventoService.delete($scope.pautaEvento.id)
                .then(function () {
                    angular.element('#apagarEventoModal').modal('hide');
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
            setPautaEventoDefault($scope);
            $scope.$root.$broadcast('REINICIAR_ORDENACAO');
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        });

        $scope.$on('ON_PESQUISAR_EVENTO_PAUTA_NOVO_FILTRO', function (ev, filtros) {
            setFiltros($scope, filtros);
            setPautaEventoDefault($scope);
            $scope.$root.$broadcast('REINICIAR_ORDENACAO');
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants)
        });


    }

    function initFiltrosPesquisa($scope, filtroAtual) {
        setFiltros($scope, filtroAtual);
    }

    function setFiltros($scope, filtros) {
        $scope.filtros = angular.copy(filtros);
        $scope.filtros.exibirFinalizados = true;
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

    function ordenarEventoPorDirecaoDataFn($scope, $cookies, pautaEventoService, jurixConstants) {
        return function () {
            if ($scope.filtros.direction === 'desc') {
                $scope.filtros.direction = 'asc';
            } else {
                $scope.filtros.direction = 'desc';
            }

            $cookies.put('directionEventos', $scope.filtros.direction);

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
                $state.go('layout.processoVisualizar', {
                    id: processoId,
                    rotaVoltarPara: 'layout.pautaEvento',
                    paramsVoltarPara: {manterPaginacao: true}
                });
            }, 500);

        };
    }

    function carregarFiltroFn($scope, pautaEventoService, jurixConstants) {
        return function (filtroUsuario) {

            $scope.$root.$broadcast('REINICIAR_ORDENACAO');
            setFiltros($scope, JSON.parse(filtroUsuario.valor));
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
        };
    }

    function carregarFiltroPadraoFn($scope, pautaEventoService, jurixConstants) {

        return function () {

            $scope.$root.$broadcast('REINICIAR_ORDENACAO');
            setFiltros($scope, pautaEventoService.getFiltroPadraoPauta());
            atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
        };

    }

    function isFiltroPadraoFn($scope, pautaEventoService) {
        return function () {
            var filtros = angular.copy($scope.filtros);
            delete filtros.page;
            delete filtros.esconderFinalizados;
            delete filtros.exibirFinalizados;

            var filtroPadrao = angular.copy(pautaEventoService.getFiltroPadraoPauta());
            delete filtroPadrao.page;
            delete filtroPadrao.esconderFinalizados;
            delete filtroPadrao.exibirFinalizados;

            var isFiltroPadrao = angular.equals(filtros, filtroPadrao);

            return isFiltroPadrao;
        };
    }

    function setEventoPautaRespository($scope, pautaEvento) {

        var fileRespository = '';
        if(pautaEvento.processo && pautaEvento.processo.id){
            fileRespository = 'processo/' + pautaEvento.processo.id + '/';
        }
        $scope.filesRespository = fileRespository + 'pautaEvento/' + pautaEvento.id;
    }

    function atualizarArquivosTemporarios($scope, pautaEventoSalvo) {
        setEventoPautaRespository($scope, pautaEventoSalvo);
        $scope.$root.$broadcast('SALVAR_ARQUIVOS_TEMPORARIOS', $scope.filesRespository);

    }

    module.controller('pautaEventoController', ['$scope', '$cookies', '$state', 'minimoCaracteresObsFinalizacaoPauta', 'pautaEventosPage', 'jurixConstants', 'colaboradoresPage', 'idEdit', 'pautaEventoService', 'ProcessoService', 'SegurancaService', 'filtrosUsuario', 'filtroAtual',
        function ($scope, $cookies, $state, minimoCaracteresObsFinalizacaoPauta, pautaEventosPage, jurixConstants, colaboradoresPage, idEdit, pautaEventoService, ProcessoService, SegurancaService, filtrosUsuario, filtroAtual) {

            $scope.statusParaOrdenacao = ['PENDENTE', 'FINALIZADO', 'FALHOU'];
            $scope.pagesSize = [10, 25];
            $scope.modoVisualizacaoEventos = $cookies.get('modoVisualizacaoEventos') ? $cookies.get('modoVisualizacaoEventos') : 'table';
            $scope.minimoObservacao = minimoCaracteresObsFinalizacaoPauta;

            $scope.podeCriarEventoColaboradores = SegurancaService.possuiPermissao('Pauta.Criar.ParaColaboradores');

            $scope.filtrosUsuario = filtrosUsuario;

            setPautaEventos($scope, pautaEventosPage);

            setPropriedadesEstado($scope, jurixConstants);

            setColaboradores($scope, colaboradoresPage);

            setPautaEventoDefault($scope);

            addHandlers($scope, pautaEventoService, jurixConstants);

            initFiltrosPesquisa($scope, filtroAtual);

            $scope.getNomeMesDoAno = getNomeMesDoAno(jurixConstants);

            $scope.salvar = salvar($scope, pautaEventoService, jurixConstants);

            $scope.finalizar = finalizar($scope, pautaEventoService, jurixConstants);

            $scope.novoEvento = novoEvento($scope);

            $scope.fecharModal = fecharModal();

            $scope.getAcao = getAcao($scope, pautaEventoService);

            $scope.getLabelEventoPendente = getLabelEventoPendente($scope);

            $scope.getLabelEventoFinalizado = getLabelEventoFinalizadoFn($scope);

            $scope.autoCompleteProcessoOptions = getAutoCompleteVincularOptions($scope, ProcessoService);

            if (idEdit) {
                abrirModalEdicao($scope, pautaEventoService, idEdit);
            }

            $scope.abrirFiltro = abrirFiltroFn($scope);

            $scope.ordenarEventoPorSituacao = ordenarEventoPorSituacaoFn($scope, pautaEventoService, jurixConstants);

            $scope.ordenarEventoPorDirecaoData = ordenarEventoPorDirecaoDataFn($scope, $cookies, pautaEventoService, jurixConstants);

            $scope.iniciarApagar = iniciarApagarFn();
            $scope.apagar = apagarFn($scope, pautaEventoService, jurixConstants);

            $scope.updatePagination = updatePaginationFn($scope, pautaEventoService, jurixConstants);

            $scope.prorrogarPrazo = prorrogarPrazoFn($scope, pautaEventoService);

            $scope.repautarEvento = repautarEventoFn($scope, pautaEventoService);

            $scope.exibirDataFinalizacao = exibirDataFinalizacaoFn();

            $scope.filtrarFinalizadosDia = filtrarFinalizadosDiaFn($scope, pautaEventoService, jurixConstants);

            $scope.irParaProcesso = irParaProcessoFn($state);

            $scope.carregarFiltroPrincipal = carregarFiltroFn($scope, pautaEventoService, jurixConstants);

            $scope.setModoVisualizacaoEventos = function (modoVisualizacao) {
                $scope.modoVisualizacaoEventos = modoVisualizacao;
                $cookies.put('modoVisualizacaoEventos', modoVisualizacao);
            };

            $scope.carregarFiltroPadrao = carregarFiltroPadraoFn($scope, pautaEventoService, jurixConstants);

            $scope.isFiltroPadrao = isFiltroPadraoFn($scope, pautaEventoService);

            $scope.$on('ARQUIVOS_TEMPORARIOS_SALVOS', function(){
                $scope.filesRespository = 'pautaEvento/novo';
            });

            $scope.getTextoMinimoObservacao = function(){

                if($scope.minimoObservacao > 0){
                    return ' com no mínimo ' + $scope.minimoObservacao + ' caracteres';
                }
                return '';
            };

            $scope.exibirFinalizadosCheckBox = {
                pesquisar : function(){
                    atualizarListaPautaEventos($scope, pautaEventoService, jurixConstants);
                }
            };

        }]);
});