define(['./module'], function (module) {
    'use strict';

    module.service('TipoAndamentoService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'tiposAndamento';

        var customResource = {
            findByFinalidade: {url: 'tiposAndamento/search/findByFinalidade', method: 'GET', isArray: false}
        };

        that.tiposAndamentoResource = CrudService.createDefaultResource(defaultUrl, customResource);

        CrudService.addDefaultCrudActions(that, that.tiposAndamentoResource);

        that.findByFinalidade = function(finalidade){
                return that.tiposAndamentoResource.findByFinalidade({finalidade:finalidade, size:1000}).$promise;
        };


    }]);
});

