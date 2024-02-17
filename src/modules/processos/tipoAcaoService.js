define(['./module'], function (module) {
    'use strict';

    module.service('TipoAcaoService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'tiposAcao';

        that.tiposAcaoResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.tiposAcaoResource);

        that.findAll = function(filter){

            filter = {};
            var respPage = [];
            return that.tiposAcaoResource.findAll(filter).$promise
                .then(function(resp){
                    respPage = resp;
                    filter.page = 1;
                    return that.tiposAcaoResource.findAll(filter).$promise;
                })
                .then(function(resp){

                    respPage._embedded.tipoAcao = respPage._embedded.tipoAcao.concat(resp._embedded.tipoAcao);

                    return respPage;
                });
        };

    }]);
});

