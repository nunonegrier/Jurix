/**
 * @author hebert ramos
 */
define(['./module'], function(app){


    app.run(['$rootScope', '$state', 'loggedUserService', function($rootScope, $state, loggedUserService) {

        $rootScope.$on('$locationChangeSuccess', function(ev, param) {

            if(!loggedUserService.getUser() && param.indexOf('/login') === -1 && param.indexOf('/recuperarSenha') === -1) {

                $rootScope.$broadcast('GO_TO_LOGIN_PAGE');
            }

        });
    }]);

});