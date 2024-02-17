/**
 * @author hebert ramos
 */
define(['./module'], function(app){

    function validarPermissao(event, toState, SegurancaService){

        if (!toState.jurixPermissoes) {
            return;
        }

        if(!SegurancaService.possuiPermissao(toState.jurixPermissoes)){
            event.preventDefault();
            alert('Você não possui permissão para acessar essa área');
        }

    }

    app.run(['$rootScope', 'SegurancaService', function($rootScope, SegurancaService) {

        $rootScope.$on('$stateChangeStart', function (event, toState) {

            validarPermissao(event, toState, SegurancaService);
        });

    }]);
});