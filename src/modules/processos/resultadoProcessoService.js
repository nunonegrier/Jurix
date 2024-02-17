define(['./module'], function (module) {
    'use strict';

    module.service('ResultadoProcessoService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'resultadosProcesso';

        that.resultadosProcessoResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.resultadosProcessoResource);

    }]);
});

