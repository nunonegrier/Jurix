define(['./module', 'jquery'], function (module, $) {
    'use strict';

    function createDefaultResource(urlServico, $resource) {

        var defaultServices = {
            findAll: {method: 'GET', isArray: false},
        };

        return $resource(urlServico + '/:id', null, defaultServices);

    }

    module.service('LocalidadeService', ['$resource', function ($resource) {

        var that = this;

        that.estadoResource = createDefaultResource('estados', $resource);
        that.municipioResource = createDefaultResource('municipios/search/findByEstado', $resource);

        that.buscarEstados = function(params){

            return that.estadoResource.findAll(params).$promise.then(function(resp){
                return resp._embedded.estado;
            });
        };

        that.buscarMunicipios = function(idEstado){
            return that.municipioResource.findAll({idEstado:idEstado, size:1000}).$promise.then(function(resp){
               return resp._embedded.municipio;
            });
        };

    }]);
});

