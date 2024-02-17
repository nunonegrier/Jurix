define(['../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.component('configuracoesPerfil', {
        template: view,
        bindings: {
            perfis: '<',
            permissoes: '<'
        },
        controller: ['perfisService', function (perfisService) {

            var ctrl = this;

             ctrl.perfilSelecionado = {};

             ctrl.message = {};

             ctrl.selecionarPerfil = function(){
                    perfisService.findById(ctrl.perfilSelecionado.id)
                            .then(function(perfil){
                                ctrl.perfilSelecionado = perfil;
                            });
                    };

             ctrl.novoPerfil = function(){
                        ctrl.perfilSelecionado = {
                            id:-1
                        };
                    };

             ctrl.isPermissaoSelected = function(permissao){
                        if(ctrl.perfilSelecionado.permissoes){
                            var permissao = ctrl.perfilSelecionado.permissoes.filter(function(perm){
                                return perm.id == permissao.id;
                            });
                            return permissao.length > 0;
                        }
                        return false;
                    };

             ctrl.salvarPerfil = function(){
                        var isNovo = ctrl.perfilSelecionado.id == -1;
                        perfisService.save(ctrl.perfilSelecionado)
                            .then(function(perfilSelecionado){

                                ctrl.perfilSelecionado = perfilSelecionado;
                                if(isNovo){
                                     ctrl.perfis.push(perfilSelecionado);
                                }

                                ctrl.message.success = true;
                            })
                            .catch(function(resp){

                                var msg = 'Não foi possível salvar o perfil.'
                                if(resp.data && resp.data.message){
                                    msg = resp.data.message
                                }

                                ctrl.message.error = true;
                                ctrl.message.errorMessage = msg;
                            });
                    };

             ctrl.deletarPerfil = function(){
                        perfisService.delete(ctrl.perfilSelecionado.id)
                              .then(function(){
                                    var index = ctrl.perfis.map(function(e) { return e.id; }).indexOf(ctrl.perfilSelecionado.id);
                                    ctrl.perfis.splice(index, 1);
                                    ctrl.perfilSelecionado = {};
                               })
                               .catch(function(resp){

                                    var msg = 'Não foi possível remover o perfil.'
                                    if(resp.data && resp.data.message){
                                        ctrl.message.error = true;
                                        ctrl.message.errorMessage = resp.data.message
                                    }

                                    ctrl.message.error = true;
                                    ctrl.message.errorMessage = resp.data.message
                               });
                               angular.element('#apagarPerfilModal').modal('hide');
                    };

                    ctrl.permissaoClick = function(permissao){

                        if(ctrl.perfilSelecionado.permissoes){

                            var index = ctrl.perfilSelecionado.permissoes.map(function(e) { return e.id; }).indexOf(permissao.id);
                            if(index != -1){
                                ctrl.perfilSelecionado.permissoes.splice(index, 1);
                            }else {
                                ctrl.perfilSelecionado.permissoes.push(permissao);
                            }
                        }else{
                            ctrl.perfilSelecionado.permissoes = [];
                            ctrl.perfilSelecionado.permissoes.push(permissao);
                        }
                    };

        }]
    });
});