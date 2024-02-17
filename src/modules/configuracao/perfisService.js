define(['./module'], function (module) {
    'use strict';

    module.service('perfisService', ['CrudService', function (CrudService) {
        var that = this;

        var defaultUrl = 'perfis';

        that.perfilResource = CrudService.createDefaultResource(defaultUrl, {findAll: {method: 'GET', isArray: true}});

        CrudService.addDefaultCrudActions(that, that.perfilResource);
    }]);
});