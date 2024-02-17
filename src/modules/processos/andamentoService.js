define(['./module'], function (module) {
    'use strict';


    function createDefaultResource($resource) {

        var urlServico = 'processos/:processoId/andamentosProcesso';


        var defaultServices = {
            findAll: {method: 'GET', isArray: true},
            findById: {method: 'GET', isArray: false, params: {id: '@id'}},
            update: {method: 'PUT', isArray: false, params: {id: '@id'}},
            create: {method: 'POST', isArray: false},
            salvarAndamentoReativacao: {url: urlServico + '/andamentoReativacao', method: 'POST', isArray: false},
        };


        return $resource(urlServico + '/:id', {'processoId': '@processoId'} , defaultServices);

    }


    module.service('AndamentoService', ['CrudService', '$resource', function (CrudService, $resource) {

        var that = this;

        that.andamentoResource = createDefaultResource($resource);

        CrudService.addDefaultCrudActions(that, that.andamentoResource);

        that.findById = function(processoId, id){
            return that.andamentoResource.findById({processoId:processoId, id:id}).$promise;
        };

        that.delete = function(processoId, id){
            return that.andamentoResource.delete({processoId:processoId, id:id}).$promise;
        };

        that.salvarAndamentoReativacao = function(andamentoProcesso){
            return that.andamentoResource.salvarAndamentoReativacao(andamentoProcesso).$promise;
        };

    }]);
});

