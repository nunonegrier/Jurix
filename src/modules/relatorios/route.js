define(['./module', 'text!./menu.html', 'text!./view.html'], function (module, menu, view) {


    'use strict';
    return module.config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('layout.relatorio', {
            id: 'relatorioProcessos',
            url: '^/relatorio',
            views: {
                content: {
                    template: view
                },
                'menu-superior': {
                    template: menu
                }
            }
        });

    }]);
});