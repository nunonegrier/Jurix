define(['../module', 'text!./modal.html', 'lodash'], function (module, view, _) {

    function initAdicionarGrupo(ctrl){

        ctrl.novoGrupo = {};
        ctrl.grupoApagar = {};

        angular.element('#adicionarGrupoClientes').modal('show');
    }

    function carregarGrupos(ctrl, GrupoClienteService){

        return GrupoClienteService.buscarGrupos()
            .then(function(grupos){
                ctrl.grupos =  grupos;
            });
    }

    module.component('modalGrupoCliente', {
        template: view,
        bindings: {},
        controller: ['$rootScope', 'GrupoClienteService', function ($rootScope, GrupoClienteService) {

            var ctrl = this;

            ctrl.$onInit = function () {
                carregarGrupos(ctrl, GrupoClienteService);
            };


            $rootScope.$on('ADICIONAR_GRUPO_CLIENTE', function () {
                initAdicionarGrupo(ctrl);
            });

            ctrl.salvarGrupo = function(){

                if(!_.isEmpty(ctrl.novoGrupo.nome)){
                    GrupoClienteService.save(ctrl.novoGrupo)
                        .then(function(grupoSalvo){

                            $rootScope.$broadcast('GRUPO_CLIENTE_SALVO', grupoSalvo);
                            angular.element('#adicionarGrupoClientes').modal('hide');

                            carregarGrupos(ctrl, GrupoClienteService);
                        });
                }
            };

            ctrl.apagarGrupo = function(){
                if(ctrl.grupoApagar.id){
                    GrupoClienteService.delete(ctrl.grupoApagar.id)
                        .then(function(){
                            return carregarGrupos(ctrl, GrupoClienteService);
                        })
                        .then(function(){
                            ctrl.grupoApagar = {};
                            alert('Grupo apagado com sucesso!');
                        })
                        .catch(function(){
                            alert('Não é possível apagar grupo, o mesmo está vinculado a clientes');
                        })
                }
            };
        }]
    });
});