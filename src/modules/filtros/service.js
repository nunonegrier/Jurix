define(['./module'], function (module) {
    'use strict';


    module.service('FiltroService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'filtrosUsuario';

        var custom = {
            getPadrao: {method: 'GET', url: defaultUrl + '/padrao/:tipo', isArray: false, params: {'tipo': '@tipo'}}
        };


        that.filtrosUsuarioResource = CrudService.createDefaultResource(defaultUrl, custom);

        CrudService.addDefaultCrudActions(that, that.filtrosUsuarioResource);

        that.findAllArray = function(params){

            var defaultParams = {size: 100000};

            if (params) {
                $.extend(defaultParams, params);
            }

            return that.findAll(defaultParams)
                .then(function(filtroUsuarioPage){
                    return filtroUsuarioPage.content;
                });
        };

        that.buscarPadrao = function(tipo){

            return that.filtrosUsuarioResource.getPadrao({tipo: tipo}).$promise
                .then(function(filtroPadrao){
                    if(filtroPadrao.id){
                        return filtroPadrao;
                    }
                    return null;
                });
        }

    }]);
});

