define(['./module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.component('jurixPaginacao', {
        template: view,
        controller: 'paginacaoController',
        bindings: {
            pagesSize: '=',
            pageObject: '<',
            pageFilters: '=',
            updatePaginationFn: '='
        }
    });
});