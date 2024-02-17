define(['../module'], function (module) {
    'use strict';


    function createDefaultResource($resource) {

        var urlServico = 'clientes/:clienteId/contratos';


        var defaultServices = {
            findAll: {method: 'GET', isArray: true},
            findById: {method: 'GET', isArray: false, params: {id: '@id'}},
            update: {method: 'PUT', isArray: false, params: {id: '@id'}},
            encerrar: {url: urlServico + '/:id/inativar', method: 'PUT', isArray: false, params: {id: '@id'}},
            create: {method: 'POST', isArray: false}
        };


        return $resource(urlServico + '/:id', {'clienteId': '@clienteId'} , defaultServices);

    }


    module.service('ContratoService', ['CrudService', '$resource', function (CrudService, $resource) {

        var that = this;

        that.contratosResource = createDefaultResource($resource);

        CrudService.addDefaultCrudActions(that, that.contratosResource);

        that.findById = function(clienteId, id){
            return that.contratosResource.findById({clienteId:clienteId, id:id}).$promise;
        };

        that.delete = function(clienteId, id){
            return that.contratosResource.delete({clienteId:clienteId, id:id}).$promise;
        };

        that.encerrar = function(clienteId, id, removerConta){
            return that.contratosResource.encerrar({clienteId:clienteId, id:id, removerConta: removerConta}).$promise;
        };

    }]);
});

