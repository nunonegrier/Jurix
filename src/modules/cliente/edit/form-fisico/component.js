define(['./../../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.directive('formFisico', function() {
        return {
            template: view
        };
    });
});