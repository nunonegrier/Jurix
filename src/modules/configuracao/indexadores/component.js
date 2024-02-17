define(['../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.component('configuracoesIndexador', {
        template: view,
        bindings: {
            parametroIndexador:'<'
        },
        controller: ['ParametroService', function (ParametroService) {

            var ctrl = this;

            ctrl.salvarIndexador = function(){
                ParametroService.save(ctrl.parametroIndexador)
                .then(function(){
                    ctrl.message.success = true;
                });
            };
        }]
    });
});