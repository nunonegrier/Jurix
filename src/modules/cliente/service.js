define(['./module'], function (module) {
    'use strict';

    module.service('ClienteService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'clientes';
        var customServices = {
            salvarFisico:  {url: defaultUrl + '/fisico', method: 'POST', isArray: false},
            salvarJuridico:  {url: defaultUrl + '/juridico', method: 'POST', isArray: false}
        };

        that.clienteResource = CrudService.createDefaultResource(defaultUrl, customServices);

        CrudService.addDefaultCrudActions(that, that.clienteResource);

        that.findAll = function(params){
          if(!params){
              params = {}
          }
          params.sort = 'nome';
          params.ignoreCase = true;

          return that.clienteResource.findAll(params).$promise;
        };

        that.salvarFisico = function(cliente){
            if(cliente.id){
                return that.clienteResource.update(cliente).$promise;
            }else {
                return that.clienteResource.salvarFisico(cliente).$promise;
            }
        };

        that.salvarJuridico = function(cliente){
            if(cliente.id){
                return that.clienteResource.update(cliente).$promise;
            }else {
                return that.clienteResource.salvarJuridico(cliente).$promise;
            }
        };

    }]);
});

