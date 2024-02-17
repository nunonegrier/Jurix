/**
 * @author hebert ramos
 */
define(['./module'], function(app){

    function addValidacaoUsuarioLogado($interval, $state, $http){
        $interval(function() {

            if($state.current.name !== 'login' && $state.current.name != 'recuperarSenha') {

                $http.get('/auth/user')
                    .then(function successCallback(response) {
                        //DO NOTHING
                    }, function errorCallback() {
                        $state.go('login');
                    });
            }

        }, 1000 * 60);
    }

    return app.run(['$rootScope', '$state', '$interval', '$http', function($rootScope, $state, $interval, $http) {

        $rootScope.$on('GO_TO_LOGIN_PAGE', function() {
            $state.go('login');
        });

        addValidacaoUsuarioLogado($interval, $state, $http);

    }]);
});