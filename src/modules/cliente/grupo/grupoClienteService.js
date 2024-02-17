define(['../module'], function (module) {
    'use strict';

    module.service('GrupoClienteService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'gruposCliente';

        that.grupoClienteResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.grupoClienteResource);

        that.buscarGrupos = function (params) {

            var defaultParams = {size: 100000, sort: 'nome'};

            if (params) {
                $.extend(defaultParams, params);
            }

            return that.grupoClienteResource.findAll(defaultParams).$promise.then(function (resp) {
                return resp._embedded.grupoCliente;
            });
        };

    }]);
});

