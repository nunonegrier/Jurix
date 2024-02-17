define(['./module'], function (module) {
    'use strict';

    module.service('contasReceberService', ['CrudService', function (CrudService) {
        var that = this;

        var defaultUrl = 'contasReceber';

        var customServices = {
            findAll: {
                url: defaultUrl + '/:centroCustoId', method: 'GET', isArray: true
            },
            pagarConta:{
                url: defaultUrl + '/pagar/:id', method: 'PUT', isArray: false, params: {id: '@id'}
            },
            buscarContaAtivaContrato:{
                url: defaultUrl + '/contrato/:contratoId/ativa', method: 'GET', isArray: false, params: {contratoId: '@contratoId'}
            }
        };

        that.contasReceberResource = CrudService.createDefaultResource(defaultUrl, customServices);

        CrudService.addDefaultCrudActions(that, that.contasReceberResource);

        that.pagarConta = function (contaReceber) {
            return   that.contasReceberResource.pagarConta({id: contaReceber.id}, contaReceber).$promise;
        };

        that.buscarContaAtivaContrato = function(contratoId){
            return that.contasReceberResource.buscarContaAtivaContrato({contratoId: contratoId}).$promise;
        };

    }]);
});