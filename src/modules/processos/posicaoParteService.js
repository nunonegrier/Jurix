define(['./module'], function (module) {
    'use strict';

    module.service('PosicaoParteService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'posicoesParte';

        that.posicoesParteResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.posicoesParteResource);

    }]);
});

