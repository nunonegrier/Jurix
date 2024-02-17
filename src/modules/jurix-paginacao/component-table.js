define(['./module', 'text!./view-table.html'], function (module, view) {
    'use strict';

    module.component('jurixPaginacaoTable', {
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