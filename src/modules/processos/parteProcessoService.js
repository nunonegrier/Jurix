define(['./module'], function (module) {
    'use strict';

    module.service('ParteProcessoService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'partesProcesso';

        that.partesProcessoResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.partesProcessoResource);

    }]);
});

