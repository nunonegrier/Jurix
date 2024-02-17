/**
 * @author hebert ramos
 */
define(['./module'], function (app) {
    'use strict';

    return app.filter('newlines', function () {
        return function(text) {
            if(text) {
                return text.replace(/\n/g, '<br/>');
            }
            return text;
        }
    });
});