/**
 * @author hebert ramos
 */
define(['./module'], function(app){

    return app.service('loggedUserService', ['$injector', function($injector){

        var that = this;

        that.getUser = function(){
            return $injector.has('loggedUser') ? $injector.get('loggedUser') : null;
        };
    }]);
});