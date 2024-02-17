define(['../module', 'text!./view.html'], function (module, view) {
        'use strict';


        module.component('confirmarApagarProcessoModal', {
            template: view,
            bindings: {
                confirmarDeletarFn: '='
            },
            controller: ['$rootScope', function ($rootScope) {

                var ctrl = this;

                $rootScope.$on('EXIBIR_MODAL_CONFIRMACAO_DELETAR_PROCESSO', function(){
                    angular.element('#apagarProcessoModal').modal('show');
                });

                $rootScope.$on('ESCONDER_MODAL_CONFIRMACAO_DELETAR_PROCESSO', function(){
                    angular.element('#apagarProcessoModal').modal('hide');
                });

                ctrl.deletarProcesso = function(){
                    ctrl.confirmarDeletarFn();
                };
            }]
        });
    });