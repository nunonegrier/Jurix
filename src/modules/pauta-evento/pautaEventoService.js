define(['./module'], function (module) {
    'use strict';

    function finalizar(that) {
        return function (pautaEvento) {
            return that.pautaEventoResource.finalizar({id: pautaEvento.id}, pautaEvento).$promise;
        };
    }

    function buscarHistoricoFn(that) {
        return function (pautaEventoId) {
            return that.pautaEventoResource.historico({id: pautaEventoId}).$promise;
        };
    }

    function findAllGeneralFn(that) {
        return function (filter) {
            return that.pautaEventoResource.findAllGeneral(filter).$promise;
        };
    }

    module.service('pautaEventoService', ['CrudService', '$cookies', function (CrudService, $cookies) {
        var that = this;

        var defaultUrl = 'pautaEventos';

        that.pautaEventoResource = CrudService.createDefaultResource(defaultUrl, {
            finalizar: {method: 'PUT', params: {id: '@id'}, url: defaultUrl + '/:id/finalizar'},
            historico: {
                method: 'GET',
                params: {id: '@id'},
                url: defaultUrl + '/:id/historicoFinalizacao',
                isArray: true
            },
            findAllGeneral: {method: 'GET', url: defaultUrl + '/geral', isArray: false},
            minimoCaracteresObsFinalizacaoPauta: {method: 'GET', url: defaultUrl + '/minimoCaracteresObsFinalizacaoPauta', isArray: false}
        });

        CrudService.addDefaultCrudActions(that, that.pautaEventoResource);

        that.finalizar = finalizar(that);

        that.buscarHistorico = buscarHistoricoFn(that);

        that.findAllGeneral = findAllGeneralFn(that);

        that.getFiltroPadraoPauta = function () {

            var direction = that.getDirectionCookie();
            return {sort: 'dataLimite', direction: direction, orderSituacao: 'PENDENTE', size: 10, esconderFinalizados: true};
        };

        that.getDirectionCookie = function(){
            return $cookies.get('directionEventos') ? $cookies.get('directionEventos') : 'desc';
        };

        that.minimoCaracteresObsFinalizacaoPauta = function () {
            return that.pautaEventoResource.minimoCaracteresObsFinalizacaoPauta().$promise
                .then(function(resp){
                    return resp.minimo
                });
        };
    }]);
});