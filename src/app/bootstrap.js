/**
 * @author hebert ramos
 */

define([
    'require',
    'angular',
    './app',
    './logged-user'
], function (require, ng, app, loggedUser) {
    'use strict';

    function bootstrapApp(document, loggedUser_){
        app.constant('loggedUser', loggedUser_);
        ng.bootstrap(document, ['app']);
    }

    require(['domReady!'], function (document) {

        loggedUser
            .then(function(loggedUserData){
                bootstrapApp(document, loggedUserData.data);
            }, function(){
                bootstrapApp(document, null);
            });

    });
});
