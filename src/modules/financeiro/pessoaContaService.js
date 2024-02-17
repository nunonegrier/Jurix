define(['./module'], function (module) {
    'use strict';

    module.service('pessoaContaService', ['CrudService', function (CrudService) {
        var that = this;

        var defaultUrl = 'pessoaConta';

        that.pessoaContaResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.pessoaContaResource);

    }]);
});