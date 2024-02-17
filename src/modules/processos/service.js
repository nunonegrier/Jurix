define(['./module'], function (module) {
    'use strict';

    module.service('ProcessoService', ['CrudService', function (CrudService) {

        var that = this;

        var defaultUrl = 'processos';

        that.iniFiltroBusca = function(){
            that.filtroBusca = {numeroDescricaoBusca: null, page:1, situacao:null};
        };

        that.iniFiltroBusca();

        that.processoResource = CrudService.createDefaultResource(defaultUrl);

        CrudService.addDefaultCrudActions(that, that.processoResource);

        that.findByIdMarcaRecente = function(id){
            return that.processoResource.findById({id:id, marcaRecente:true}).$promise;
        };

        that.save = function(processoDto){
            if(processoDto.processo.id){
                return that.processoResource.update({id:processoDto.processo.id}, processoDto).$promise;
            }else{
                return that.processoResource.create(processoDto).$promise;
            }
        };

    }]);
});

