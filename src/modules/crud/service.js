define(['./module', 'jquery'], function (module, $) {
    'use strict';

    function createDefaultResource($resource){


        return function(urlServico, customServices){

            var defaultServices = {
                findAll: {method: 'GET', isArray: false, params:{size: 10000}},
                findById: {method: 'GET', isArray: false, params: {id: '@id'}},
                update:  {method: 'PUT', isArray: false, params: {id: '@id'}},
                create:  {method: 'POST', isArray: false},
                delete: {method: 'DELETE', isArray: false}
            };

            if(customServices){
                $.extend(defaultServices, customServices);
            }

            return $resource(urlServico + '/:id', null, defaultServices);
        }
    }

    module.service('CrudService', ['$resource', function ($resource) {

        var that = this;

        that.createDefaultResource = createDefaultResource($resource);

        that.addDefaultCrudActions = function(customService, customResource){

            customService.findAll = function(filter){
                return customResource.findAll(filter).$promise;
            };

            customService.findById = function(id){
                return customResource.findById({id:id}).$promise;
            };

            customService.save = function(entity){
                if(entity.id){
                    return customResource.update(entity).$promise;
                }else{
                    return customResource.create(entity).$promise;
                }
            };

            customService.delete = function(id){
                return customResource.delete({id: id}).$promise;
            };
        };

    }]);
});

