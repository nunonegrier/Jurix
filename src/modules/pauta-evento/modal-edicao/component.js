define(['../module', 'text!./modal.html'], function (module, view) {
    'use strict';

    function initComponent(ctrl, $rootScope, colaboradorService) {

        ctrl.usuarioAtual = $rootScope.usuarioAtual;

        ctrl.auxiliar = {};
        ctrl.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

        colaboradorService.findAll()
            .then(function(colaboradoresPage){
                ctrl.colaboradores = colaboradoresPage.content;
            });

    }

    function initEditarPautaEvento(pautaEventoService, ctrl, pautaEventoId) {

        pautaEventoService.findById(pautaEventoId)
            .then(function (pautaEvento) {

                ctrl.pautaEvento = pautaEvento;

                return pautaEventoService.buscarHistorico(pautaEventoId);
            })
            .then(function (historicos) {

                ctrl.historicoPautaEvento = historicos;

                ctrl.usuarioPodeAlterarFinalizado = false;
                ctrl.modoFinalizacao = false;
                ctrl.modoVisualizacao = true;
                ctrl.validarDadosFinalizacao = true;

                if (ctrl.pautaEvento.situacao !== 'PENDENTE') {
                    ctrl.auxiliar.eventoBemSucedido = ctrl.pautaEvento.situacao == 'FINALIZADO' ? 'SIM' : 'NAO';
                } else {
                    ctrl.auxiliar.eventoBemSucedido = null;
                }

                angular.element('#eventoModalEdicao').modal('show');

                setEventoPautaRespository(ctrl);
            });
    }

    function setEventoPautaRespository(ctrl) {
        var fileRespository = '';
        if(ctrl.pautaEvento.processo && ctrl.pautaEvento.processo.id){
            fileRespository = 'processo/' + ctrl.pautaEvento.processo.id + '/';
        }
        ctrl.filesRespository = fileRespository + 'pautaEvento/' + ctrl.pautaEvento.id;
    }


    module.component('modalPautaEventoEdicao', {
        template: view,
        bindings: {},
        controller: ['$rootScope', 'pautaEventoService', 'colaboradorService', function ($rootScope, pautaEventoService, colaboradorService) {

            var ctrl = this;

            ctrl.$onInit = function () {
                initComponent(ctrl, $rootScope, colaboradorService);
            };

            $rootScope.$on('ON_EDITAR_PAUTA_EVENTO', function (evt, pautaEventoId) {
                initEditarPautaEvento(pautaEventoService, ctrl, pautaEventoId);
            });
        }]
    });
});