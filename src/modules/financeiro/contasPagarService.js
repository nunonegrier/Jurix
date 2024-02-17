define(['./module'], function (module) {
    'use strict';

    function buscarPerfis(perfilResource) {
        return function () {
            return perfilResource.buscarTodos().$promise;
        };
    }

    module.service('contasPagarService', ['CrudService', function (CrudService) {
        var that = this;

        var defaultUrl = 'contasPagar';

        var customServices = {
            findAll: {
                url: defaultUrl + '/:centroCustoId', method: 'GET', isArray: true
            },
            pagarConta:{
                url: defaultUrl + '/pagar/:id', method: 'PUT', isArray: false, params: {id: '@id'}
            }
        };

        that.contasPagarResource = CrudService.createDefaultResource(defaultUrl, customServices);

        CrudService.addDefaultCrudActions(that, that.contasPagarResource);

        that.pagarConta = function (contaPagar) {
          return   that.contasPagarResource.pagarConta({id: contaPagar.id}, contaPagar).$promise;
        };

    }]);
});