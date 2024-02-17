define(['../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.component('pautaOrdenacao', {
        template: view,
        bindings: {
            updateSortFn: '=',
            ordenacao: '='
        },
        controller: ['$rootScope', function ($rootScope) {

            var ctrl = this;

            ctrl.ordenacao = ctrl.ordenacao ? ctrl.ordenacao : 'desc';

            ctrl.ordenarClick = function(){
                ctrl.ordenacao = ctrl.ordenacao === 'asc' ? 'desc' : 'asc';
                ctrl.updateSortFn();
            }
        }]
    });
});