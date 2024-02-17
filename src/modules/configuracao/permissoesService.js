define(['./module'], function (module) {
    'use strict';

    module.service('permissoesService', ['CrudService', function (CrudService) {
        var that = this;

        var defaultUrl = 'permissoes';

        that.permissoesResource = CrudService.createDefaultResource(defaultUrl, {findAll: {method: 'GET', isArray: true}});

        CrudService.addDefaultCrudActions(that, that.permissoesResource);
    }]);
});