define(['./module'], function (module) {
    'use strict';

    module.service('ParametroService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'parametros';

        var customServices = {
            findByChave: {url: defaultUrl + '/search/findByChave', method: 'GET', isArray: false}
        };

        that.paramtrosResource = CrudService.createDefaultResource(defaultUrl, customServices);

        CrudService.addDefaultCrudActions(that, that.paramtrosResource);

        that.findByChave = function(chave){
            return that.paramtrosResource.findByChave({chave: chave}).$promise
            .then(function(resp){
                if(resp._embedded.parametro.length > 0){
                    return resp._embedded.parametro[0];
                }
                return null;
            });
        };

    }]);
});