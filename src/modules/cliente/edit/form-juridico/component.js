define(['./../../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.directive('formJuridico', function() {
        return {
            template: view
        };
    });
});