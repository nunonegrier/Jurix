define(['../module', 'text!./modal.html', '../pautaEventoController'], function (module, view,pautaEventoController) {
    'use strict';
    module.directive('modalPautaEvento', [function () {
        return {
            restrict: 'E',
            template: view,
            controller: pautaEventoController
        };
    }]);
});