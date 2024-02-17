define(['./module'], function (module) {
    'use strict';

    module.service('CentroCustoService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'centrosCusto';

        that.centrosCustoResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.centrosCustoResource);

    }]);
});

