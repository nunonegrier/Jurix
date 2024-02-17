define(['./module'], function (module) {
    'use strict';

    module.service('ComarcaService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'comarcas';

        var customServices = {
            findAll: {url: defaultUrl + '/search/findByEstado', method: 'GET', isArray: false}
        };

        that.comarcasResource = CrudService.createDefaultResource(defaultUrl, customServices);

        CrudService.addDefaultCrudActions(that, that.comarcasResource);

    }]);
});

