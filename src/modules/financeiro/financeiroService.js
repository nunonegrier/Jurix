define(['./module'], function (module) {
    'use strict';

    function criarResource($resource) {

        var defaultServices = {
            findAll: {method: 'GET', isArray: false},
            getCentroCustoDefault: {url: 'financeiro/centroCustoDefault', method: 'GET', isArray: false},
            setCentroCustoDefault: {url: 'financeiro/centroCustoDefault', method: 'POST', isArray: false}
        };

        return $resource('financeiro/:centroCustoId', null,  defaultServices);
    }

    module.service('financeiroService', ['$resource', function ($resource) {
        var that = this;

        that.resource = criarResource($resource);

        that.buscarDadosFinanceiros = function (mes, ano, centroCustoId) {
          return  that.resource.findAll({centroCustoId: centroCustoId, mes: mes, ano:ano}).$promise;
        };

        that.buscarDadosFinanceirosParams = function (params) {
            return  that.resource.findAll(params).$promise;
        };

        that.getCentroCustoDefault = function(){
            return that.resource.getCentroCustoDefault().$promise;
        };

        that.setCentroCustoDefault = function(centroId){
            return that.resource.setCentroCustoDefault({"centroId": centroId}).$promise;
        };

    }]);
});