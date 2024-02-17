define(['./module'], function (module) {
    'use strict';

    function buscarPerfis(perfilResource) {
        return function () {
            return perfilResource.buscarTodos().$promise;
        };
    }

    module.service('colaboradorService', ['CrudService', function (CrudService) {
        var that = this;

        var defaultUrl = 'colaboradores';

        var perfilUrl = 'perfis';

        that.colaboradorResource = CrudService.createDefaultResource(defaultUrl, {});

        that.perfilResource = CrudService.createDefaultResource(perfilUrl, {buscarTodos: {method: 'GET', isArray: true}});

        that.buscarPerfis = buscarPerfis(that.perfilResource);

        CrudService.addDefaultCrudActions(that, that.colaboradorResource);
    }]);
});